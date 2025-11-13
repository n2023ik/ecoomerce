const mongoose = require('../db');

const sellerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  storeName: { type: String, required: true },
  storeDescription: String,
  storeLogo: String,
  businessEmail: String,
  businessPhone: String,
  status: { type: String, enum: ['pending', 'approved', 'blocked'], default: 'pending' },
  rating: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  commission: { type: Number, default: 10 }, // percentage
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seller', sellerSchema);
