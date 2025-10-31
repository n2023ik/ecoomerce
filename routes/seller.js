const express = require('express');
const router = express.Router();
const Seller = require('../models/seller');
const User = require('../models/user');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Register as seller
router.post('/register', async (req, res) => {
  try {
    const { userId, storeName, storeDescription, businessEmail, businessPhone } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Check if already a seller
    const existingSeller = await Seller.findOne({ userId });
    if (existingSeller) return res.status(400).json({ error: 'Already registered as seller' });
    
    const seller = new Seller({
      userId,
      storeName,
      storeDescription,
      businessEmail,
      businessPhone
    });
    
    await seller.save();
    
    // Update user role
    user.role = 'seller';
    await user.save();
    
    res.status(201).json(seller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all sellers (admin)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const sellers = await Seller.find().populate('userId', 'username email');
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve seller (admin)
router.patch('/:id/approve', requireAuth, requireAdmin, async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    res.json(seller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Block seller (admin)
router.patch('/:id/block', requireAuth, requireAdmin, async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { status: 'blocked' },
      { new: true }
    );
    res.json(seller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
