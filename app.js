const express = require('express');
const app = express();
const mongoose = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');

// Import routes
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');
const authRoute = require('./routes/auth');
const sellerRoute = require('./routes/seller');
const dashboardRoute = require('./routes/dashboard');
const couponRoute = require('./routes/coupon');
const notificationRoute = require('./routes/notification');
const returnRoute = require('./routes/return');
const disputeRoute = require('./routes/dispute');
const reviewRoute = require('./routes/review');
const wishlistRoute = require('./routes/wishlist');
const analyticsRoute = require('./routes/analytics');
const settingsRoute = require('./routes/settings');

// Security and performance middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Compression middleware
app.use(compression());

// Body parser with increased limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

// API Routes
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/auth', authRoute);
app.use('/api/sellers', sellerRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/coupons', couponRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/returns', returnRoute);
app.use('/api/disputes', disputeRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/wishlist', wishlistRoute);
app.use('/api/analytics', analyticsRoute);
app.use('/api/settings', settingsRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║   🛒 E-COMMERCE PLATFORM - React + Node.js               ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝`);
  console.log(`\n🚀 Backend API: http://localhost:${PORT}`);
  console.log(`� Frontend: http://localhost:5173 (Run: cd client && npm run dev)`);
  console.log(`\n📊 API ENDPOINTS:`);
  console.log(`   ✅ Products, Orders, Auth, Sellers, Dashboard`);
  console.log(`   ✅ Coupons, Notifications, Returns, Disputes`);
  console.log(`   ✅ Reviews, Wishlist, Analytics, Settings`);
  console.log(`\n💾 Database: MongoDB Connected`);
  console.log(`\n═══════════════════════════════════════════════════════════\n`);
});
