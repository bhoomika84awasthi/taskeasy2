const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: String,
  url: String,
  mimeType: String,
  size: Number,
});

const timelineEventSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  event: { type: String, required: true },
  description: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

const workItemSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', default: null },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', default: null },
  columnId: { type: String, default: null },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, default: 'Task' },
  state: { type: String, default: 'New' },
  order: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  valueArea: { type: String, default: null },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachments: [attachmentSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  timeSpent: { type: Number, default: 0 }, // in hours
  reason: { type: String, default: '' }, // reason if not completed
  timeline: {
    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    completedDate: { type: Date, default: null },
    events: [timelineEventSchema],
  },
}, { timestamps: true });

workItemSchema.index({ projectId: 1, boardId: 1, columnId: 1, order: 1 });

module.exports = mongoose.model('WorkItem', workItemSchema);
