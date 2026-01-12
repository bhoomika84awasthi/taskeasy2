const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  order: { type: Number, default: 0 },
  wipLimit: { type: Number, default: null },
});

const boardSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  type: { type: String, default: 'backlog' },
  columns: [columnSchema],
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });
// Index by projectId for project-scoped queries
boardSchema.index({ projectId: 1 });

module.exports = mongoose.model('Board', boardSchema);
