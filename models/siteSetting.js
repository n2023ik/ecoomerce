const mongoose = require('../db');

const siteSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
  type: { type: String, enum: ['string', 'number', 'boolean', 'object', 'array'], default: 'string' },
  category: { 
    type: String, 
    enum: ['general', 'payment', 'shipping', 'email', 'commission', 'security', 'appearance'],
    default: 'general'
  },
  description: String,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
});

// Default settings
const defaultSettings = [
  { key: 'site_name', value: 'ShopHub', type: 'string', category: 'general', description: 'Website name' },
  { key: 'site_email', value: 'support@shophub.com', type: 'string', category: 'general', description: 'Contact email' },
  { key: 'commission_rate', value: 10, type: 'number', category: 'commission', description: 'Platform commission %' },
  { key: 'shipping_fee', value: 5.99, type: 'number', category: 'shipping', description: 'Standard shipping fee' },
  { key: 'free_shipping_threshold', value: 50, type: 'number', category: 'shipping', description: 'Free shipping above this amount' },
  { key: 'tax_rate', value: 8.5, type: 'number', category: 'payment', description: 'Tax rate %' },
  { key: 'currency', value: 'USD', type: 'string', category: 'payment', description: 'Currency code' },
  { key: 'items_per_page', value: 12, type: 'number', category: 'general', description: 'Products per page' },
  { key: 'allow_guest_checkout', value: true, type: 'boolean', category: 'general', description: 'Allow checkout without account' },
  { key: 'maintenance_mode', value: false, type: 'boolean', category: 'general', description: 'Enable maintenance mode' }
];

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
module.exports.defaultSettings = defaultSettings;
