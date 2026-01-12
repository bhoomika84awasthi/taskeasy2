const express = require('express');
const Sprint = require('../models/Sprint');
const auth = require('../middleware/auth');
const projectAuth = require('../middleware/projectAuth');

const router = express.Router({ mergeParams: true });

// GET all sprints for a project
router.get('/', auth, projectAuth, async (req, res) => {
  try {
    const projectId = req.projectId;
    const sprints = await Sprint.find({ projectId });
    res.json({ sprints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new sprint
router.post('/', auth, projectAuth, async (req, res) => {
  try {
    const projectId = req.projectId;
    const { name, goal, startDate, endDate, state } = req.body;
    
    const sprint = new Sprint({
      projectId,
      name,
      goal,
      startDate,
      endDate,
      state: state || 'planned',
      createdBy: req.userId,
    });
    
    await sprint.save();
    res.status(201).json({ sprint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update sprint state
router.patch('/:sprintId', auth, projectAuth, async (req, res) => {
  try {
    const { sprintId } = req.params;
    const { state } = req.body;
    
    const sprint = await Sprint.findOneAndUpdate({ _id: sprintId, projectId: req.projectId }, { state }, { new: true });
    res.json({ sprint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a sprint
router.delete('/:sprintId', auth, projectAuth, async (req, res) => {
  try {
    const { sprintId } = req.params;
    const deleted = await Sprint.findOneAndDelete({ _id: sprintId, projectId: req.projectId });
    if (!deleted) return res.status(404).json({ message: 'Sprint not found or cross-project access' });
    res.json({ message: 'Sprint deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;