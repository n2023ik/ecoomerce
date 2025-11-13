const express = require('express');
const router = express.Router();
const Return = require('../models/return');
const { createNotification } = require('./notification');

// Get all returns (Admin)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const returns = await Return.find(query)
      .populate('customer', 'username email')
      .populate('seller', 'storeName')
      .populate('order')
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(returns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get returns for seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const returns = await Return.find({ seller: req.params.sellerId })
      .populate('customer', 'username email')
      .populate('order')
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(returns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get returns for customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const returns = await Return.find({ customer: req.params.customerId })
      .populate('seller', 'storeName')
      .populate('order')
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(returns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create return request
router.post('/', async (req, res) => {
  try {
    const returnRequest = new Return(req.body);
    await returnRequest.save();
    
    // Notify seller
    await createNotification({
      recipient: returnRequest.seller,
      recipientRole: 'seller',
      type: 'dispute_opened',
      title: 'New Return Request',
      message: `Customer has requested a return for order #${returnRequest.order}`,
      relatedOrder: returnRequest.order
    });
    
    res.status(201).json(returnRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update return status (Seller/Admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, adminNotes, approvedBy } = req.body;
    
    const returnRequest = await Return.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        adminNotes,
        approvedBy,
        approvedAt: status === 'approved' ? new Date() : undefined,
        refundedAt: status === 'refunded' ? new Date() : undefined,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    // Notify customer
    await createNotification({
      recipient: returnRequest.customer,
      recipientRole: 'customer',
      type: 'dispute_resolved',
      title: 'Return Request Updated',
      message: `Your return request has been ${status}`,
      relatedOrder: returnRequest.order
    });
    
    res.json(returnRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete return request
router.delete('/:id', async (req, res) => {
  try {
    await Return.findByIdAndDelete(req.params.id);
    res.json({ message: 'Return request deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
