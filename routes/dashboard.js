const express = require('express');
const router = express.Router();
const Seller = require('../models/seller');
const Product = require('../models/product');
const Order = require('../models/order');

// Get seller dashboard stats
router.get('/seller/dashboard/:userId', async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.params.userId });
    if (!seller) return res.status(404).json({ error: 'Seller not found' });

    const products = await Product.find({ seller: seller._id });
    const orders = await Order.find({ 'items.seller': seller._id });

    const stats = {
      totalSales: seller.totalSales,
      totalRevenue: seller.totalRevenue,
      totalProducts: products.length,
      totalOrders: orders.length,
      rating: seller.rating,
      status: seller.status,
      storeInfo: {
        name: seller.storeName,
        description: seller.storeDescription,
        logo: seller.storeLogo
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admin dashboard stats
router.get('/admin/dashboard', async (req, res) => {
  try {
    const User = require('../models/user');
    
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalSellers = await Seller.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'username email');

    const stats = {
      totalUsers,
      totalCustomers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer dashboard stats
router.get('/customer/dashboard/:userId', async (req, res) => {
  try {
    const User = require('../models/user');
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const stats = {
      totalOrders: orders.length,
      loyaltyPoints: user.loyaltyPoints,
      wishlistCount: user.wishlist.length,
      addressCount: user.addresses.length,
      recentOrders: orders
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
