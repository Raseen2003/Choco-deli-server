require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const itemsRouter = require('./routes/items');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

// DB Connection
const connectDB = require('./db');
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
