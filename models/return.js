const mongoose = require('../db');

const returnSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    quantity: Number,
    price: Number,
    reason: { 
      type: String, 
      enum: ['defective', 'wrong_item', 'not_as_described', 'size_issue', 'changed_mind', 'other'],
      required: true 
    }
  }],
  returnType: { type: String, enum: ['refund', 'exchange'], default: 'refund' },
  reason: { type: String, required: true },
  description: String,
  images: [String],
  status: { 
    type: String, 
    enum: ['requested', 'approved', 'rejected', 'picked_up', 'received', 'refunded', 'completed'],
    default: 'requested'
  },
  refundAmount: Number,
  refundMethod: { type: String, enum: ['original_payment', 'store_credit', 'bank_transfer'] },
  pickupAddress: {
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  trackingNumber: String,
  adminNotes: String,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  refundedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Return', returnSchema);
