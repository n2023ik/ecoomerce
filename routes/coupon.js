const express = require('express');
const router = express.Router();
const Coupon = require('../models/coupon');

// Get all coupons (Admin only)
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate coupon code (Customer/Seller)
router.post('/validate', async (req, res) => {
  try {
    const { code, cartTotal, products } = req.body;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    // Check minimum purchase
    if (cartTotal < coupon.minPurchase) {
      return res.status(400).json({ 
        error: `Minimum purchase of $${coupon.minPurchase} required` 
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      },
      discount: discount,
      finalTotal: cartTotal - discount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create coupon (Admin only)
router.post('/', async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update coupon (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(coupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete coupon (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply coupon to order
router.post('/apply', async (req, res) => {
  try {
    const { couponId } = req.body;
    const coupon = await Coupon.findById(couponId);
    
    if (coupon) {
      coupon.usedCount += 1;
      await coupon.save();
    }
    
    res.json({ message: 'Coupon applied successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
