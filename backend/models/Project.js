const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: null },
  logo: { type: String, default: null }, // filename or URL
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // members: explicit list of users who have access to this project
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// Index members for fast membership checks
projectSchema.index({ members: 1 });

module.exports = mongoose.model('Project', projectSchema);
