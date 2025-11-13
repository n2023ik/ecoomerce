const mongoose = require('../db');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientRole: { type: String, enum: ['customer', 'seller', 'admin'], required: true },
  type: { 
    type: String, 
    enum: [
      'order_placed', 'order_confirmed', 'order_shipped', 'order_delivered', 'order_cancelled',
      'product_approved', 'product_rejected', 'seller_approved', 'seller_rejected',
      'new_review', 'low_stock', 'dispute_opened', 'dispute_resolved',
      'payment_received', 'payout_processed', 'price_drop', 'back_in_stock',
      'system_alert', 'promotion'
    ],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: String, // URL to relevant page
  icon: String, // Icon class or URL
  relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  relatedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// Index for faster queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
