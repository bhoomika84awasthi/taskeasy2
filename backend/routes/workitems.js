const express = require('express');
const router = express.Router();
const WorkItem = require('../models/WorkItem');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const projectAuth = require('../middleware/projectAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage });

// GET /projects/:projectId/workitems
router.get('/projects/:projectId/workitems', auth, projectAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log('=== Fetching work items ===');
    console.log('ProjectId:', projectId);
    console.log('User ID:', req.userId);

    // validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.log('Invalid projectId format');
      return res.status(400).json({ message: 'Invalid projectId' });
    }
    const { boardId, state, type, assignee, search, page = 1, limit = 100 } = req.query;

    const filter = { projectId: new mongoose.Types.ObjectId(projectId) };
    if (boardId) filter.boardId = boardId;
    if (state) filter.state = state;
    if (type) filter.type = type;
    if (assignee) filter.assignees = assignee;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    console.log('Filter:', JSON.stringify(filter));
    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const items = await WorkItem.find(filter)
      .populate('sprintId', 'name state')
      .sort({ order: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    const total = await WorkItem.countDocuments(filter);
    console.log('Found', items.length, 'work items, total:', total);
    console.log('Items:', JSON.stringify(items));
    res.json({ items, total });
  } catch (err) {
    console.error('Error fetching work items:', err);
    res.status(500).json({ message: 'Failed to fetch work items', error: err.message });
  }
});

// GET single
router.get('/projects/:projectId/workitems/:itemId', auth, projectAuth, async (req, res) => {
  try {
    const { projectId, itemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) return res.status(400).json({ message: 'Invalid projectId' });
    if (!mongoose.Types.ObjectId.isValid(itemId)) return res.status(400).json({ message: 'Invalid itemId' });

    const item = await WorkItem.findOne({ _id: itemId, projectId: new mongoose.Types.ObjectId(projectId) }).lean();
    if (!item) return res.status(404).json({ message: 'Work item not found in this project' });
    res.json({ item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch work item' });
  }
});

// Create (supports JSON or multipart/form-data with attachments)
router.post('/projects/:projectId/workitems', auth, projectAuth, upload.array('attachments'), async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log('=== Creating work item ===');
    console.log('ProjectId:', projectId);
    console.log('Body:', req.body);

    // fields from multipart come in req.body (strings) or JSON body
    const body = { ...(req.body || {}) };
    // convert numeric fields
    if (body.points !== undefined) body.points = Number(body.points);
    if (body.order !== undefined) body.order = Number(body.order);

    // attachments from multer
    const attachments = (req.files || []).map((f) => ({
      filename: f.filename,
      url: `/uploads/${f.filename}`,
      mimeType: f.mimetype,
      size: f.size,
    }));

    // determine order if not provided: max(order) + 1 within same projectId + boardId + columnId
    if (body.order === undefined || body.order === null || body.order === '') {
      const filter = { projectId: new mongoose.Types.ObjectId(projectId) };
      if (body.boardId) filter.boardId = body.boardId;
      if (body.columnId) filter.columnId = body.columnId;
      const maxDoc = await WorkItem.find(filter).sort({ order: -1 }).limit(1).lean();
      const maxOrder = (maxDoc && maxDoc[0] && typeof maxDoc[0].order === 'number') ? maxDoc[0].order : 0;
      body.order = maxOrder + 1;
    }

    const payload = {
      projectId: new mongoose.Types.ObjectId(projectId),
      title: body.title || body.name || 'Untitled',
      description: body.description || '',
      type: body.type || 'Task',
      state: body.state || 'New',
      boardId: body.boardId || null,
      columnId: body.columnId || null,
      sprintId: body.sprintId ? new mongoose.Types.ObjectId(body.sprintId) : null,
      order: body.order,
      points: body.points || 0,
      valueArea: body.valueArea || null,
      assignees: body.assignees ? (Array.isArray(body.assignees) ? body.assignees : [body.assignees]) : [],
      attachments,
      createdBy: req.userId || null,
      timeline: body.timeline ? {
        startDate: body.timeline.startDate ? new Date(body.timeline.startDate) : null,
        dueDate: body.timeline.dueDate ? new Date(body.timeline.dueDate) : null,
        completedDate: body.timeline.completedDate ? new Date(body.timeline.completedDate) : null,
        events: body.timeline.events || [],
      } : undefined,
    };

    console.log('Payload:', JSON.stringify(payload));
    const item = new WorkItem(payload);
    await item.save();
    console.log('Work item created:', item._id);

    res.status(201).json({ item });
  } catch (err) {
    console.error('Error creating work item:', err);
    res.status(500).json({ message: 'Failed to create work item', error: err.message });
  }
});

// Update (supports JSON or multipart with attachments)
router.patch('/projects/:projectId/workitems/:itemId', auth, projectAuth, upload.array('attachments'), async (req, res) => {
  try {
    const { projectId, itemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) return res.status(400).json({ message: 'Invalid projectId' });
    if (!mongoose.Types.ObjectId.isValid(itemId)) return res.status(400).json({ message: 'Invalid itemId' });

    const existing = await WorkItem.findOne({ _id: itemId, projectId: new mongoose.Types.ObjectId(projectId) });
    if (!existing) return res.status(404).json({ message: 'Work item not found in this project' });

    // build updates from body
    const body = { ...(req.body || {}) };
    if (body.points !== undefined) body.points = Number(body.points);
    if (body.order !== undefined) body.order = Number(body.order);

    const updateFields = {};
    const allowed = ['title','description','type','state','boardId','columnId','sprintId','order','points','valueArea','assignees','timeline','timeSpent','reason'];
    allowed.forEach(k => { 
      if (body[k] !== undefined) {
        if (k === 'timeline' && body[k]) {
          updateFields[k] = {
            startDate: body[k].startDate ? new Date(body[k].startDate) : null,
            dueDate: body[k].dueDate ? new Date(body[k].dueDate) : null,
            completedDate: body[k].completedDate ? new Date(body[k].completedDate) : null,
            events: body[k].events || [],
          };
        } else {
          updateFields[k] = body[k];
        }
      }
    });

    // handle assignees coming as JSON string or single value
    if (body.assignees) {
      try {
        if (typeof body.assignees === 'string') {
          const parsed = JSON.parse(body.assignees);
          updateFields.assignees = Array.isArray(parsed) ? parsed : [parsed];
        }
      } catch {
        updateFields.assignees = Array.isArray(body.assignees) ? body.assignees : [body.assignees];
      }
    }

    // attachments: new uploaded files should be appended
    const newAttachments = (req.files || []).map((f) => ({ filename: f.filename, url: `/uploads/${f.filename}`, mimeType: f.mimetype, size: f.size }));

    // removeAttachments may be a JSON array of filenames
    let removeAttachments = [];
    if (body.removeAttachments) {
      try { removeAttachments = typeof body.removeAttachments === 'string' ? JSON.parse(body.removeAttachments) : body.removeAttachments; } catch { removeAttachments = [body.removeAttachments]; }
    }

    // apply update
    Object.assign(existing, updateFields);

    if (newAttachments.length) {
      existing.attachments = (existing.attachments || []).concat(newAttachments);
    }

    // remove requested attachments (and delete files)
    if (Array.isArray(removeAttachments) && removeAttachments.length) {
      existing.attachments = (existing.attachments || []).filter(att => {
        if (removeAttachments.includes(att.filename) || removeAttachments.includes(att.url)) {
          const filePath = path.join(uploadsDir, att.filename);
          try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) { console.warn('failed to delete file', filePath, e); }
          return false;
        }
        return true;
      });
    }

    await existing.save();
    res.json({ item: existing.toObject() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update work item' });
  }
});

// Bulk update
router.post('/projects/:projectId/workitems/bulk-update', auth, projectAuth, async (req, res) => {
  try {
    const { updates } = req.body; // [{ id, columnId, boardId, state, order }, ...]
    if (!Array.isArray(updates)) return res.status(400).json({ message: 'Invalid payload' });

    const results = { updated: [], failed: [] };

    await Promise.all(updates.map(async (u) => {
      try {
        const updateFields = {};
        if (u.columnId !== undefined) updateFields.columnId = u.columnId;
        if (u.boardId !== undefined) updateFields.boardId = u.boardId;
        if (u.state !== undefined) updateFields.state = u.state;
        if (u.order !== undefined) updateFields.order = u.order;

        const updated = await WorkItem.findOneAndUpdate({ _id: u.id, projectId: req.projectId }, updateFields, { new: true }).lean();
        if (updated) results.updated.push(updated._id);
        else results.failed.push(u.id);
      } catch {
        results.failed.push(u.id);
      }
    }));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Bulk update failed' });
  }
});

// Delete
router.delete('/projects/:projectId/workitems/:itemId', auth, projectAuth, async (req, res) => {
  try {
    const { projectId, itemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) return res.status(400).json({ message: 'Invalid projectId' });
    if (!mongoose.Types.ObjectId.isValid(itemId)) return res.status(400).json({ message: 'Invalid itemId' });

    const item = await WorkItem.findOne({ _id: itemId, projectId: new mongoose.Types.ObjectId(projectId) }).lean();
    if (!item) return res.status(404).json({ message: 'Work item not found in this project' });

    // delete attachment files if present
    if (item.attachments && Array.isArray(item.attachments)) {
      for (const att of item.attachments) {
        const filePath = path.join(uploadsDir, att.filename || '');
        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) { console.warn('failed to delete file', filePath, e); }
      }
    }

    await WorkItem.findOneAndDelete({ _id: itemId, projectId: new mongoose.Types.ObjectId(projectId) });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete work item' });
  }
});

// GET time log summary for a project
router.get('/projects/:projectId/time-log-summary', auth, projectAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, fromDate, toDate, sprintId } = req.query;

    console.log('Time log summary request:', {
      projectId,
      projectIdLength: projectId?.length,
      userId,
      fromDate,
      toDate,
      sprintId
    });

    // validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.error('Invalid projectId format:', projectId);
      return res.status(400).json({ message: 'Invalid projectId format' });
    }

    const filter = { projectId: new mongoose.Types.ObjectId(projectId) };
    
    // Filter by user if provided
    if (userId) {
      filter.assignees = new mongoose.Types.ObjectId(userId);
    }
    
    // Filter by sprint if provided
    if (sprintId) {
      filter.sprintId = new mongoose.Types.ObjectId(sprintId);
    }
    
    // Filter by date range if provided
    if (fromDate || toDate) {
      filter['timeline.startDate'] = {};
      if (fromDate) {
        filter['timeline.startDate'].$gte = new Date(fromDate);
      }
      if (toDate) {
        filter['timeline.startDate'].$lte = new Date(toDate);
      }
    }

    console.log('Database filter:', JSON.stringify(filter, null, 2));

    const items = await WorkItem.find(filter)
      .populate('assignees', 'name email')
      .populate('sprintId', 'name')
      .lean();

    console.log(`Found ${items.length} work items matching the filter`);
    
    // Log first item to see structure
    if (items.length > 0) {
      console.log('First item structure:', JSON.stringify(items[0], null, 2));
    }

    // Group items by assignee and date
    const timeLogs = {};
    let itemsWithAssignees = 0;
    let itemsWithoutAssignees = 0;
    
    items.forEach(item => {
      const startDate = item.timeline?.startDate 
        ? new Date(item.timeline.startDate).toISOString().split('T')[0]
        : null;
      
      if (item.assignees && item.assignees.length > 0) {
        itemsWithAssignees++;
        item.assignees.forEach(assignee => {
          const user = assignee.name;
          if (!timeLogs[user]) {
            timeLogs[user] = {};
          }
          if (startDate) {
            if (!timeLogs[user][startDate]) {
              timeLogs[user][startDate] = [];
            }
            timeLogs[user][startDate].push({
              title: item.title,
              type: item.type,
              timeSpent: item.timeSpent || 0,
              sprintName: item.sprintId?.name || 'Unplanned',
            });
          }
        });
      } else {
        itemsWithoutAssignees++;
        // Include unassigned items under "Unassigned"
        const user = 'Unassigned';
        if (!timeLogs[user]) {
          timeLogs[user] = {};
        }
        if (startDate) {
          if (!timeLogs[user][startDate]) {
            timeLogs[user][startDate] = [];
          }
          timeLogs[user][startDate].push({
            title: item.title,
            type: item.type,
            timeSpent: item.timeSpent || 0,
            sprintName: item.sprintId?.name || 'Unplanned',
          });
        }
      }
    });

    console.log('Time log summary response:', {
      itemsFound: items.length,
      itemsWithAssignees,
      itemsWithoutAssignees,
      timeLogs: Object.keys(timeLogs),
      totalTimeLogsCount: Object.keys(timeLogs).reduce((sum, user) => sum + Object.keys(timeLogs[user]).length, 0)
    });

    res.json({ timeLogs, items });
  } catch (err) {
    console.error('Error fetching time log summary:', err);
    res.status(500).json({ message: 'Failed to fetch time log summary', error: err.message });
  }
});

module.exports = router;
