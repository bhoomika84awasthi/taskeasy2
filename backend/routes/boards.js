const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const auth = require('../middleware/auth');
const projectAuth = require('../middleware/projectAuth');

// Get boards for project
router.get('/projects/:projectId/boards', auth, projectAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const boards = await Board.find({ projectId }).lean();
    res.json({ boards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch boards' });
  }
});

// Get single board
router.get('/projects/:projectId/boards/:boardId', auth, projectAuth, async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.boardId, projectId: req.projectId }).lean();
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json({ board });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch board' });
  }
});

// Create board
router.post('/projects/:projectId/boards', auth, projectAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const payload = req.body;
    payload.projectId = projectId;
    const board = new Board(payload);
    await board.save();
    res.status(201).json({ board });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create board' });
  }
});

// Update board
router.patch('/projects/:projectId/boards/:boardId', auth, projectAuth, async (req, res) => {
  try {
    const updates = req.body;
    const board = await Board.findOneAndUpdate({ _id: req.params.boardId, projectId: req.projectId }, updates, { new: true }).lean();
    if (!board) return res.status(404).json({ message: 'Board not found or cross-project access' });
    res.json({ board });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update board' });
  }
});

// Delete board
router.delete('/projects/:projectId/boards/:boardId', auth, projectAuth, async (req, res) => {
  try {
    const deleted = await Board.findOneAndDelete({ _id: req.params.boardId, projectId: req.projectId });
    if (!deleted) return res.status(404).json({ message: 'Board not found or cross-project access' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete board' });
  }
});

module.exports = router;
