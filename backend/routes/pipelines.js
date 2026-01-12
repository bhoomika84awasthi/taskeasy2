const express = require('express');
const Pipeline = require('../models/Pipeline');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const projectAuth = require('../middleware/projectAuth');

const router = express.Router({ mergeParams: true });

// POST /api/pipelines - Create a new pipeline (project-scoped)
router.post('/', auth, projectAuth, async (req, res) => {
  try {
    const { name, description, stages } = req.body;
    const projectId = req.projectId;

    if (!name) return res.status(400).json({ message: 'Pipeline name is required' });

    const pipeline = new Pipeline({
      name,
      description: description || null,
      projectId,
      stages: stages || [],
      createdBy: req.userId || null,
    });

    await pipeline.save();
    res.status(201).json({ message: 'Pipeline created successfully', pipeline });
  } catch (err) {
    console.error('Create pipeline error:', err);
    res.status(500).json({ message: 'Failed to create pipeline', error: err.message });
  }
});

// GET /api/pipelines/:projectId - Get all pipelines for a project
router.get('/', auth, projectAuth, async (req, res) => {
  try {
    const projectId = req.projectId;

    const pipelines = await Pipeline.find({ projectId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .lean();

    res.status(200).json({ pipelines });
  } catch (err) {
    console.error('Get pipelines error:', err);
    res.status(500).json({ message: 'Failed to fetch pipelines', error: err.message });
  }
});

// GET /api/pipelines/detail/:id - Get a single pipeline
// GET single pipeline within project
router.get('/detail/:id', auth, projectAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const pipeline = await Pipeline.findOne({ _id: id, projectId: req.projectId })
      .populate('createdBy', 'name email')
      .lean();

    if (!pipeline) return res.status(404).json({ message: 'Pipeline not found in this project' });
    res.status(200).json({ pipeline });
  } catch (err) {
    console.error('Get pipeline error:', err);
    res.status(500).json({ message: 'Failed to fetch pipeline', error: err.message });
  }
});

// PUT /api/pipelines/:id - Update a pipeline
router.put('/:id', auth, projectAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, stages } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (status !== undefined) update.status = status;
    if (stages !== undefined) update.stages = stages;

    const pipeline = await Pipeline.findOneAndUpdate({ _id: id, projectId: req.projectId }, update, { new: true });
    if (!pipeline) return res.status(404).json({ message: 'Pipeline not found or cross-project access' });

    res.status(200).json({ message: 'Pipeline updated successfully', pipeline });
  } catch (err) {
    console.error('Update pipeline error:', err);
    res.status(500).json({ message: 'Failed to update pipeline', error: err.message });
  }
});

// DELETE /api/pipelines/:id - Delete a pipeline
router.delete('/:id', auth, projectAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const pipeline = await Pipeline.findOneAndDelete({ _id: id, projectId: req.projectId });
    if (!pipeline) return res.status(404).json({ message: 'Pipeline not found or cross-project access' });
    res.status(200).json({ message: 'Pipeline deleted successfully' });
  } catch (err) {
    console.error('Delete pipeline error:', err);
    res.status(500).json({ message: 'Failed to delete pipeline', error: err.message });
  }
});

module.exports = router;
