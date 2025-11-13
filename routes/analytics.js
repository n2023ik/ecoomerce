const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const Seller = require('../models/seller');

// Admin analytics - Overall platform stats
router.get('/admin', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // Revenue over time
    const revenueByDay = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: 'delivered' } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      { $group: {
        _id: '$items.productId',
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }},
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      { $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }},
      { $unwind: '$product' }
    ]);
    
    // Top sellers
    const topSellers = await Seller.find()
      .sort({ totalRevenue: -1 })
      .limit(10)
      .populate('userId', 'username');
    
    // Category-wise sales
    const categoryStats = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      { $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'product'
      }},
      { $unwind: '$product' },
      { $group: {
        _id: '$product.category',
        count: { $sum: 1 },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }},
      { $sort: { revenue: -1 } }
    ]);
    
    // User growth
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Overall stats
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const totalUsers = await User.countDocuments();
    const totalSellers = await Seller.countDocuments({ status: 'approved' });
    const totalProducts = await Product.countDocuments({ status: 'approved' });
    const totalOrders = await Order.countDocuments();
    
    res.json({
      overview: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders
      },
      revenueByDay,
      topProducts,
      topSellers,
      categoryStats,
      userGrowth
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seller analytics
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    const seller = await Seller.findById(req.params.sellerId);
    
    // Revenue over time
    const revenueByDay = await Order.aggregate([
      { $match: { 
        createdAt: { $gte: startDate },
        'items.seller': mongoose.Types.ObjectId(req.params.sellerId)
      }},
      { $unwind: '$items' },
      { $match: { 'items.seller': mongoose.Types.ObjectId(req.params.sellerId) } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        orders: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Best selling products
    const bestProducts = await Product.find({ seller: req.params.sellerId })
      .sort({ sold: -1 })
      .limit(10);
    
    // Order status breakdown
    const ordersByStatus = await Order.aggregate([
      { $match: { 'items.seller': mongoose.Types.ObjectId(req.params.sellerId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      seller: {
        name: seller.storeName,
        totalRevenue: seller.totalRevenue,
        totalSales: seller.totalSales,
        rating: seller.rating
      },
      revenueByDay,
      bestProducts,
      ordersByStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customer analytics
router.get('/customer/:customerId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.customerId });
    
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    // Category preferences
    const categoryPreferences = await Order.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.params.customerId) } },
      { $unwind: '$items' },
      { $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'product'
      }},
      { $unwind: '$product' },
      { $group: {
        _id: '$product.category',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      totalSpent,
      totalOrders,
      avgOrderValue,
      categoryPreferences
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
