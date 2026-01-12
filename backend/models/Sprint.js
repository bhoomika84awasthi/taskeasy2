const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    goal: String,
    startDate: Date,
    endDate: Date,
    state: {
      type: String,
      enum: ['planned', 'active', 'completed'],
      default: 'planned',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index by projectId for fast project-scoped queries
sprintSchema.index({ projectId: 1 });
module.exports = mongoose.model('Sprint', sprintSchema);