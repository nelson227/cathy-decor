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

// Initialize Express app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Liste des origines autorisées
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://cathy-decor.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove undefined values
    
    console.log('CORS Check:', {
      requestOrigin: origin,
      allowedOrigins: allowedOrigins,
      frontendUrlEnv: process.env.FRONTEND_URL
    });
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.some(allowed => allowed === origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

// Security Middleware
app.use(helmet());
app.use(cors(corsOptions));

// Additional OPTIONS handler for preflight
app.options('*', cors(corsOptions));

// Logging Middleware
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Connect to SQLite Database
connectDB();

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

// Start Server
const PORT = process.env.PORT || 5000;
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
