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
import settingsRoutes from './routes/settings.routes.js';

const app = express();
const PORT = process.env.PORT || 5050;

// Enable comprehensive CORS for all frontends and Vercel deployments
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
app.use(cors());
app.options('*', cors());

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
app.use('/api/settings', settingsRoutes);

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

// Root landing endpoint
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Vegetable E-Commerce Backend is running live 🥬',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      settings: '/api/settings',
    },
  });
});

// Export app for Vercel Serverless Functions
export default app;

// Only listen when not in Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Vegetable E-Commerce Backend running at http://localhost:${PORT}`);
    console.log(`🥬 API Endpoints available at http://localhost:${PORT}/api/`);
  });
}
