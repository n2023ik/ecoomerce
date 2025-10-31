const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');
const { createNotification } = require('./notification');

// Get user's wishlist
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('wishlist');
    res.json(user.wishlist || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to wishlist
router.post('/:userId/add', async (req, res) => {
  try {
    const { productId } = req.body;
    
    const user = await User.findById(req.params.userId);
    
    if (!user.wishlist) {
      user.wishlist = [];
    }
    
    // Check if already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }
    
    user.wishlist.push(productId);
    await user.save();
    
    const updatedUser = await User.findById(req.params.userId).populate('wishlist');
    res.json(updatedUser.wishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove from wishlist
router.delete('/:userId/remove/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== req.params.productId
    );
    
    await user.save();
    
    const updatedUser = await User.findById(req.params.userId).populate('wishlist');
    res.json(updatedUser.wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear wishlist
router.delete('/:userId/clear', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { wishlist: [] });
    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if product is in wishlist
router.get('/:userId/check/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const isInWishlist = user.wishlist && user.wishlist.includes(req.params.productId);
    res.json({ isInWishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get wishlist count
router.get('/:userId/count', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json({ count: user.wishlist ? user.wishlist.length : 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
