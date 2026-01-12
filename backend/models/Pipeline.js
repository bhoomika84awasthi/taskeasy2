const mongoose = require('mongoose');

const pipelineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: null },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' },
  stages: [{ type: Object }], // Array of pipeline stages
  lastRun: { type: Date, default: null },
  runCount: { type: Number, default: 0 },
}, { timestamps: true });
// Index by projectId for project-scoped queries
pipelineSchema.index({ projectId: 1 });

module.exports = mongoose.model('Pipeline', pipelineSchema);
