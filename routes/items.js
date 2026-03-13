const express = require('express');
const Item = require('../models/Item');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({}).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new item (Admin)
router.post('/', protect, admin, async (req, res) => {
  const { name, description, price, amount, imageUrl } = req.body;

  try {
    const item = await Item.create({ name, description, price, amount, imageUrl });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH to update item stock (Admin currently, possibly generic later)
router.patch('/:id', protect, admin, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, {
      ...req.body
    }, { new: true });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE an item (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
