const express = require('express');
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const fs = require('fs');
const WikiPage = require('../models/WikiPage');

const router = express.Router();

// configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST /api/projects - create project with optional logo upload
router.post('/', auth, upload.single('logo'), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'title is required' });

    const projectData = {
      title,
      description: description || null,
    };

    if (req.file) {
      // store file path relative to uploads
      projectData.logo = `/uploads/${req.file.filename}`;
    }

    // Optionally: set createdBy from authenticated user if auth implemented
    // set ownership and membership to creator
    projectData.createdBy = req.userId || null;
    projectData.members = req.userId ? [req.userId] : [];

    const project = new Project(projectData);
    await project.save();

    // Create a default wiki page for the new project
    try {
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      fs.mkdirSync(uploadsDir, { recursive: true });

      const safeName = `${Date.now()}-${project.title.replace(/[^a-zA-Z0-9.\-_]/g, '-')}.html`;
      const filePathOnDisk = path.join(uploadsDir, safeName);
      const initialContent = `<h1>${project.title} Wiki</h1>\n<p>Welcome to the wiki for ${project.title}.</p>`;
      fs.writeFileSync(filePathOnDisk, initialContent, 'utf8');

      const url = `/uploads/${safeName}`;
      await WikiPage.create({
        title: 'Home',
        projectId: project._id,
        url,
        content: initialContent,
        createdBy: project.createdBy || null,
      });
    } catch (wikiErr) {
      console.error('Failed to create default wiki for project:', wikiErr);
      // don't fail project creation if wiki creation fails
    }

    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// GET /api/projects - list projects the user has access to
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const projects = await Project.find({ $or: [{ createdBy: userId }, { members: userId }] }).sort({ createdAt: -1 }).lean();
    res.json({ projects });
  } catch (err) {
    console.error('Fetch projects error:', err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id - get project by id (only if user has access)
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).lean();
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const userId = req.userId;
    const isCreator = project.createdBy && String(project.createdBy) === String(userId);
    const isMember = Array.isArray(project.members) && project.members.some(m => String(m) === String(userId));
    if (!isCreator && !isMember) return res.status(403).json({ message: 'Access denied to this project' });
    res.json(project);
  } catch (err) {
    console.error('Fetch project error:', err);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
});

// PUT /api/projects/:id - update project by id
router.put('/:id', auth, upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ message: 'title is required' });

    const updateData = {
      title,
      description: description || null,
    };

    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }

    // ensure user has access to modify
    const existing = await Project.findById(id).lean();
    if (!existing) return res.status(404).json({ message: 'Project not found' });
    const userId = req.userId;
    const isCreator = existing.createdBy && String(existing.createdBy) === String(userId);
    const isMember = Array.isArray(existing.members) && existing.members.some(m => String(m) === String(userId));
    if (!isCreator && !isMember) return res.status(403).json({ message: 'Access denied' });

    const project = await Project.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    res.json({ message: 'Project updated', project });
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Project.findById(id).lean();
    if (!existing) return res.status(404).json({ message: 'Project not found' });
    // only creator can delete project
    if (!existing.createdBy || String(existing.createdBy) !== String(req.userId)) {
      return res.status(403).json({ message: 'Only project creator can delete the project' });
    }
    await Project.findByIdAndDelete(id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

module.exports = router;
