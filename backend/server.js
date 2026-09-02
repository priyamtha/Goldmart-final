import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect MongoDB and auto-seed if empty
import Product from './models/Product.js';
import seedProducts from './data/productsSeed.js';

connectDB().then(async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(seedProducts);
      console.log('✅ [AutoSeed] Seeded initial jewellery products into MongoDB!');
    }
  } catch (err) {
    console.warn('[AutoSeed] Error checking/seeding products:', err.message);
  }
});

// Core Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Favicon handler
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    app: 'Goldmart E-Commerce API',
    timestamp: new Date().toISOString(),
    liveMetalRates: {
      gold24KPerGram: 7200,
      gold22KPerGram: 6600,
      gold18KPerGram: 5400,
      silverPerGram: 88
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Express Global Error]:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 [Goldmart API Server] Running on http://localhost:${PORT}`);
  console.log(`📡 Health Check Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`==================================================\n`);
});
