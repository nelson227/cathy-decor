import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/sequelize.js';
import { formatErrorResponse, logError } from './utils/errors.js';

// Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Ensure NODE_ENV is set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Initialize Express app
const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://cathy-decor.vercel.app'
];

// Add FRONTEND_URL if it exists in environment
if (process.env.FRONTEND_URL && process.env.FRONTEND_URL.trim()) {
  const frontendUrl = process.env.FRONTEND_URL.trim().replace(/\/$/, '');
  allowedOrigins.push(frontendUrl);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked:', { origin, allowedOrigins });
      callback(null, true); // Allow for now, log the attempt
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
};

// Security Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Logging Middleware
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploaded files statically with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Max-Age', '86400');
  next();
}, express.static(path.join(__dirname, '../public/uploads')));

// Dedicated image endpoint with explicit CORS headers
app.get('/api/image/:folder/:filename', (req, res) => {
  try {
    const { folder, filename } = req.params;
    // Security: prevent directory traversal
    if (folder.includes('..') || filename.includes('..')) {
      return res.status(400).json({ error: 'Invalid path' });
    }
    
    // Set CORS headers BEFORE sending file
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Max-Age', '86400');
    
    const filePath = path.join(__dirname, '../public/uploads', folder, filename);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Image serve error:', error);
    res.status(500).json({ error: 'Error serving image' });
  }
});

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Cathy Décor API running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// CORS Diagnostics endpoint
app.get('/api/cors-check', (req, res) => {
  res.json({
    origin: req.get('origin') || 'No origin header',
    frontendUrl: process.env.FRONTEND_URL || 'Not set',
    allowedOrigins: [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
      'https://cathy-decor.vercel.app'
    ].filter(Boolean),
    isAllowed: req.get('origin') ? 'Check console for CORS result' : 'No origin to check'
  });
});

// Import Routes
import authRoutes from './routes/auth.js';
import decorationRoutes from './routes/decorations.js';
import salleRoutes from './routes/salles.js';
import commandeRoutes from './routes/commandes.js';
import serviceRoutes from './routes/services.js';
import testimonialRoutes from './routes/testimonials.js';
import favoriteRoutes from './routes/favorites.js';
import uploadRoutes from './routes/upload.js';
import statsRoutes from './routes/stats.js';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/decorations', decorationRoutes);
app.use('/api/salles', salleRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.path
  });
});

// Error Handler
app.use((err, req, res, next) => {
  logError(err, req);
  const errorResponse = formatErrorResponse(err);
  
  res.status(errorResponse.statusCode).json({
    success: false,
    message: errorResponse.message,
    ...(errorResponse.errors && { errors: errorResponse.errors }),
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// Start Server - Connect to DB first, then listen
const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════╗
║  🚀 Cathy Décor API Server Started  ║
╠════════════════════════════════════╣
║  Port: ${PORT}
║  Environment: ${process.env.NODE_ENV || 'development'}
║  API: http://localhost:${PORT}/api
║  Health: http://localhost:${PORT}/health
╚════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // You could send this to an error tracking service here
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Graceful shutdown
  server.close(() => {
    process.exit(1);
  });
});

export default app;
