const mongoose = require('../db');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
