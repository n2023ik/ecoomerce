const express = require('express');
const router = express.Router();
const Dispute = require('../models/dispute');
const { createNotification } = require('./notification');

// Get all disputes (Admin)
router.get('/', async (req, res) => {
  try {
    const { status, priority } = req.query;
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    const disputes = await Dispute.find(query)
      .populate('customer', 'username email')
      .populate('seller', 'storeName')
      .populate('order')
      .sort({ createdAt: -1 });
    
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get disputes for seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const disputes = await Dispute.find({ seller: req.params.sellerId })
      .populate('customer', 'username email')
      .populate('order')
      .sort({ createdAt: -1 });
    
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get disputes for customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const disputes = await Dispute.find({ customer: req.params.customerId })
      .populate('seller', 'storeName')
      .populate('order')
      .sort({ createdAt: -1 });
    
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create dispute
router.post('/', async (req, res) => {
  try {
    const dispute = new Dispute(req.body);
    await dispute.save();
    
    // Notify admin and seller
    await createNotification({
      recipient: dispute.seller,
      recipientRole: 'seller',
      type: 'dispute_opened',
      title: 'New Dispute Opened',
      message: `Customer has opened a dispute: ${dispute.subject}`,
      relatedOrder: dispute.order
    });
    
    res.status(201).json(dispute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add message to dispute
router.post('/:id/message', async (req, res) => {
  try {
    const { sender, senderType, message } = req.body;
    
    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { messages: { sender, senderType, message } },
        updatedAt: new Date()
      },
      { new: true }
    );
    
    res.json(dispute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update dispute status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, resolution, resolvedBy } = req.body;
    
    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        resolution,
        resolvedBy,
        resolvedAt: (status === 'resolved' || status === 'closed') ? new Date() : undefined,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    // Notify customer
    await createNotification({
      recipient: dispute.customer,
      recipientRole: 'customer',
      type: 'dispute_resolved',
      title: 'Dispute Updated',
      message: `Your dispute has been ${status}`,
      relatedOrder: dispute.order
    });
    
    res.json(dispute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
