const mongoose = require('mongoose');

const deliveryPlanSchema = new mongoose.Schema(
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
    description: String,
    startDate: Date,
    deliveryDate: Date,
    numberOfSprints: {
      type: Number,
      default: 0,
    },
    numberOfTasks: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'on-hold', 'delayed'],
      default: 'draft',
    },
    isDelayed: {
      type: Boolean,
      default: false,
    },
    delayReason: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index by projectId for project-scoped queries
deliveryPlanSchema.index({ projectId: 1 });

module.exports = mongoose.model('DeliveryPlan', deliveryPlanSchema);
