const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const WikiPage = require('../models/WikiPage');
const auth = require('../middleware/auth');
const projectAuth = require('../middleware/projectAuth');

// POST /api/wiki
// Expects JSON: { filename, filepath (html), projectid, userid }
router.post('/', auth, projectAuth, async (req, res) => {
  try {
    const { filename, filepath, userid } = req.body;
    const projectid = req.projectId;
    if (!filename || !filepath || !projectid) {
      return res.status(400).json({ message: 'filename, filepath and projectId are required' });
    }

    // ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });

    // sanitize filename and append timestamp to avoid collisions
    const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '-')}`;
    const filePathOnDisk = path.join(uploadsDir, safeName);

    // write file (html)
    fs.writeFileSync(filePathOnDisk, filepath, 'utf8');

    const url = `/uploads/${safeName}`;

    // create DB record
    const title = filename.replace(/\.html?$/i, '');
    const page = await WikiPage.create({
      title,
      projectId: projectid,
      url,
      content: filepath,
      createdBy: userid || null,
    });

    return res.status(201).json({ message: 'Wiki saved', url, page });
  } catch (err) {
    console.error('Error saving wiki', err);
    return res.status(500).json({ message: 'Failed to save wiki', error: err.message });
  }
});

// GET /api/wiki?projectId=<id>
// Returns wiki pages for the given project
router.get('/', auth, projectAuth, async (req, res) => {
  try {
    const projectId = req.projectId;
    const pages = await WikiPage.find({ projectId }).sort({ createdAt: -1 }).lean();
    return res.json({ pages });
  } catch (err) {
    console.error('Error fetching wiki pages', err);
    return res.status(500).json({ message: 'Failed to fetch wiki pages', error: err.message });
  }
});

module.exports = router;
