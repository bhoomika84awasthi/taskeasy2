const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Additional profile fields
  gst: {
    type: String,
    default: null,
  },
  organization: {
    type: String,
    default: null,
  },
  contact: {
    type: String,
    default: null,
  },
  employeeCount: {
    type: Number,
    default: null,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // If password wasn't modified, nothing to do
  if (!this.isModified('password')) return next();

  // If the password already appears to be a bcrypt hash, skip hashing
  // bcrypt hashes usually start with $2a$ or $2b$ or $2y$
  if (typeof this.password === 'string' && this.password.startsWith('$2')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);