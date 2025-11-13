const mongoose = require('../db');

const disputeSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  type: { 
    type: String, 
    enum: ['product_issue', 'delivery_issue', 'refund_request', 'wrong_item', 'damaged_item', 'other'],
    required: true 
  },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
  status: { 
    type: String, 
    enum: ['open', 'in_progress', 'resolved', 'closed', 'escalated'],
    default: 'open'
  },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  resolution: String,
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderType: { type: String, enum: ['customer', 'seller', 'admin'] },
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dispute', disputeSchema);
