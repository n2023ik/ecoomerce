const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/review');
const Product = require('../models/product');
const { createNotification } = require('./notification');

// Get reviews for product
router.get('/product/:productId', async (req, res) => {
  try {
    const { sort = '-createdAt', rating } = req.query;
    const query = { product: req.params.productId };
    
    if (rating) {
      query.rating = parseInt(rating);
    }
    
    const reviews = await Review.find(query)
      .populate('user', 'username')
      .sort(sort);
    
    const avgRating = await Review.aggregate([
      { $match: { product: mongoose.Types.ObjectId(req.params.productId) } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    
    res.json({
      reviews,
      averageRating: avgRating[0]?.avg || 0,
      totalReviews: avgRating[0]?.count || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reviews by user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate('product', 'name image')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    
    // Update product rating
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(review.product, {
      rating: avgRating,
      reviewCount: reviews.length
    });
    
    // Notify seller
    const product = await Product.findById(review.product).populate('seller');
    if (product.seller) {
      await createNotification({
        recipient: product.seller.userId,
        recipientRole: 'seller',
        type: 'new_review',
        title: 'New Product Review',
        message: `New ${review.rating}-star review for ${product.name}`,
        relatedProduct: product._id
      });
    }
    
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update review
router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    // Recalculate product rating
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(review.product, {
      rating: avgRating
    });
    
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    await review.remove();
    
    // Recalculate product rating
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    
    await Product.findByIdAndUpdate(review.product, {
      rating: avgRating,
      reviewCount: reviews.length
    });
    
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
