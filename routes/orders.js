const express = require('express');
const Order = require('../models/Order');
const Item = require('../models/Item');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all orders (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('items.item').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new order
router.post('/', async (req, res) => {
  const { customerName, customerEmail, items, totalPrice } = req.body;

  // Start a transaction-like update for item amounts
  try {
    // Basic stock check and update (Note: In production, use real transactions)
    for (let orderItem of items) {
      const dbItem = await Item.findById(orderItem.item);
      if (!dbItem) {
        return res.status(404).json({ error: `Item ${orderItem.item} not found` });
      }
      if (dbItem.amount < orderItem.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${dbItem.name}` });
      }
    }

    // Deduct stock
    for (let orderItem of items) {
      await Item.findByIdAndUpdate(orderItem.item, {
        $inc: { amount: -orderItem.quantity }
      });
    }

    const order = await Order.create({
      customerName,
      customerEmail,
      items,
      totalPrice
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH to update order status (Admin)
router.patch('/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    }, { new: true });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
