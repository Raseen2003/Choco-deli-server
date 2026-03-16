require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const itemsRouter = require('./routes/items');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');

const app = express();

// Middleware

const corsOptions = {
  origin: 'https://choco-deli.vercel.app', // No trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly include OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes
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
