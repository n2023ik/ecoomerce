const mongoose = require('../db');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
  category: String,
  stock: { type: Number, default: 100 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
