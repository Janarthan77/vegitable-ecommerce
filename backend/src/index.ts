import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

import productRoutes from './routes/products.routes.js';
import categoryRoutes from './routes/categories.routes.js';
import orderRoutes from './routes/orders.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 5050;

// Enable CORS for frontend store and admin
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads (for local fallback files if Cloudflare R2 credentials not provided)
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Vegetable E-Commerce API is running',
    cloudflareStorage: Boolean(
      process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
      process.env.CLOUDFLARE_R2_ACCOUNT_ID !== 'your_cloudflare_account_id'
    ),
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Vegetable E-Commerce Backend running at http://localhost:${PORT}`);
  console.log(`🥬 API Endpoints available at http://localhost:${PORT}/api/`);
});
