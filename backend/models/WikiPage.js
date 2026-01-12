const mongoose = require('mongoose');

const wikiPageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  url: { type: String, required: true },
  content: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
// Index by projectId for project-scoped queries
wikiPageSchema.index({ projectId: 1 });

module.exports = mongoose.model('WikiPage', wikiPageSchema);
