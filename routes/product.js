const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Get all products with pagination and caching
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const category = req.query.category;

    // Set cache headers
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache

    let query = {};
    if (category) query.category = category;

    const products = await Product.find(query)
      .select('name price images category rating sold stock')
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();

    const total = await Product.countDocuments(query);

    res.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single product with caching
router.get('/:id', async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=600'); // 10 minutes cache

    const product = await Product.findById(req.params.id)
      .populate('seller', 'storeName rating')
      .lean()
      .exec();
    
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
