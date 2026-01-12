const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, name, email, password, gst, organization, contact, employeeCount } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      username: username || name,
      email,
      password,
      gst: gst || null,
      organization: organization || null,
      contact: contact || null,
      employeeCount: employeeCount || null,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email not registered' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Optionally update profile fields if provided in the login request
    const { gst, organization, contact, employeeCount, username: newUsername, name: newName } = req.body;
    if (gst || organization || contact || employeeCount || newUsername || newName) {
      const update = {};
      if (gst) update.gst = gst;
      if (organization) update.organization = organization;
      if (contact) update.contact = contact;
      if (employeeCount) update.employeeCount = employeeCount;
      if (newUsername) update.username = newUsername;
      if (newName && !newUsername) update.username = newName;

      await User.findByIdAndUpdate(user._id, update, { new: true });
    }

    // Fetch fresh user document to include any updates
    const freshUser = await User.findById(user._id).lean();

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: freshUser._id,
        username: freshUser.username,
        email: freshUser.email,
        gst: freshUser.gst || null,
        organization: freshUser.organization || null,
        contact: freshUser.contact || null,
        employeeCount: freshUser.employeeCount || null,
        createdAt: freshUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login. Please try again.' });
  }
});

// Import a full user record (for local/testing use)
router.post('/import', async (req, res) => {
  try {
    const payload = req.body;
    const { email, username } = payload;
    if (!email || !username) return res.status(400).json({ message: 'email and username are required' });

    // Avoid duplicate
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // Create user - pre-save will skip hashing if password begins with $2
    const user = new User(payload);
    await user.save();

    res.status(201).json({ message: 'User imported', user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ message: 'Failed to import user' });
  }
});

module.exports = router;