const mongoose = require('mongoose');
const Project = require('../models/Project');

/**
 * projectAuth middleware
 * - extracts projectId from params/header/query/body
 * - validates format and existence
 * - attaches req.project and req.projectId
 */
module.exports = async function projectAuth(req, res, next) {
  try {
    // Ensure the request is authenticated; auth middleware should set req.userId
    if (!req.userId) return res.status(401).json({ message: 'Authentication required for project access' });

    const projectId = req.params.projectId || req.headers['x-project-id'] || req.query.projectId || req.body?.projectId;
    if (!projectId) return res.status(400).json({ message: 'projectId is required' });
    if (!mongoose.Types.ObjectId.isValid(projectId)) return res.status(400).json({ message: 'Invalid projectId' });

    const project = await Project.findById(projectId).lean();
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const userId = String(req.userId);

    // Check access: creator or explicit member
    const isCreator = project.createdBy && String(project.createdBy) === userId;
    const isMember = Array.isArray(project.members) && project.members.some(m => String(m) === userId);
    if (!isCreator && !isMember) return res.status(403).json({ message: 'Access to this project is forbidden' });

    // Attach verified project
    req.project = project;
    req.projectId = String(project._id);
    next();
  } catch (err) {
    console.error('projectAuth error:', err);
    res.status(500).json({ message: 'Project validation failed' });
  }
};
