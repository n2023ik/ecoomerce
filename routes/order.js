const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .populate('items.productId')
      .populate('items.seller')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products');
    if (!order) return res.status(404).send('Order not found');
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { user, username, items, total, status, shippingAddress } = req.body;
    
    // Enforce login for placing orders
    if (!user) {
      return res.status(401).json({ error: 'Login required to place orders' });
    }
    
    // Transform items to match schema (handle both 'product' and 'productId' fields)
    const formattedItems = (items || []).map(item => ({
      product: item.product || item.productId,
      productId: item.product || item.productId,
      seller: item.seller,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1
    }));
    
    const order = new Order({ 
      user, 
      username: username || 'Guest', 
      items: formattedItems, 
      total, 
      status: status || 'pending',
      shippingAddress: typeof shippingAddress === 'string' 
        ? { address: shippingAddress, city: '', state: '', zipCode: '' }
        : shippingAddress
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update order status
router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).send('Order not found');
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
