const express = require('express');
const DeliveryPlan = require('../models/DeliveryPlan');
const auth = require('../middleware/auth');
const projectAuth = require('../middleware/projectAuth');

const router = express.Router({ mergeParams: true });

// GET all delivery plans for a project
router.get('/', auth, projectAuth, async (req, res) => {
  try {
    const projectId = req.projectId;
    const plans = await DeliveryPlan.find({ projectId }).sort({ createdAt: -1 });
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single delivery plan
router.get('/:planId', auth, projectAuth, async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await DeliveryPlan.findOne({ _id: planId, projectId: req.projectId });
    if (!plan) return res.status(404).json({ error: 'Plan not found or cross-project access' });
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new delivery plan
router.post('/', auth, projectAuth, async (req, res) => {
  try {
    const projectId = req.projectId;
    const { 
      name, 
      description, 
      startDate, 
      deliveryDate, 
      numberOfSprints, 
      numberOfTasks, 
      status,
      isDelayed,
      delayReason 
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Plan name is required' });
    }

    const plan = new DeliveryPlan({
      projectId,
      name,
      description: description || '',
      startDate: startDate || null,
      deliveryDate: deliveryDate || null,
      numberOfSprints: numberOfSprints || 0,
      numberOfTasks: numberOfTasks || 0,
      status: status || 'draft',
      isDelayed: isDelayed || false,
      delayReason: delayReason || null,
      createdBy: req.userId,
    });

    await plan.save();
    res.status(201).json({ plan });
  } catch (err) {
    console.error('Error creating plan:', err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH update delivery plan
router.patch('/:planId', auth, projectAuth, async (req, res) => {
  try {
    const { planId } = req.params;
    const { 
      name, 
      description, 
      startDate, 
      deliveryDate, 
      numberOfSprints, 
      numberOfTasks, 
      status,
      isDelayed,
      delayReason 
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (deliveryDate !== undefined) updateData.deliveryDate = deliveryDate;
    if (numberOfSprints !== undefined) updateData.numberOfSprints = numberOfSprints;
    if (numberOfTasks !== undefined) updateData.numberOfTasks = numberOfTasks;
    if (status !== undefined) updateData.status = status;
    if (isDelayed !== undefined) updateData.isDelayed = isDelayed;
    if (delayReason !== undefined) updateData.delayReason = delayReason;

    const plan = await DeliveryPlan.findOneAndUpdate({ _id: planId, projectId: req.projectId }, updateData, { new: true, runValidators: true });

    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json({ plan });
  } catch (err) {
    console.error('Error updating plan:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE delivery plan
router.delete('/:planId', auth, projectAuth, async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await DeliveryPlan.findOneAndDelete({ _id: planId, projectId: req.projectId });
    if (!plan) return res.status(404).json({ error: 'Plan not found or cross-project access' });
    res.json({ message: 'Plan deleted', plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
