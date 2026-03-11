import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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

// Security Middleware - with relaxed settings for file uploads
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Logging Middleware
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize test images if they don't exist
const initializeTestImages = () => {
  const uploadsDir = path.join(__dirname, '../public/uploads/decorations');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory');
  }
  
  // Minimal 1x1 PNG (transparent)
  const pngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00,
    0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01,
    0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F,
    0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
    0x54, 0x08, 0x99, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00,
    0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  
  // Create test images
  ['test-image-1.jpg', 'test-image-2.jpg'].forEach(filename => {
    const filePath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, pngBuffer);
        console.log(`✅ Created test image: ${filename}`);
      } catch (error) {
        console.error(`❌ Error creating test image: ${error.message}`);
      }
    }
  });
};

// Initialize test images
initializeTestImages();


// CORS headers middleware for uploads
const uploadsCorsMiddleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
};

// Serve uploaded files with CORS
app.use('/uploads', uploadsCorsMiddleware, express.static(path.join(__dirname, '../public/uploads'), {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Dedicated image endpoint with explicit CORS headers - CORS SAFE
app.get('/api/image/:folder/:filename', cors(), (req, res) => {
  try {
    const { folder, filename } = req.params;
    // Security: prevent directory traversal
    if (folder.includes('..') || filename.includes('..')) {
      return res.status(400).json({ error: 'Invalid path' });
    }
    
    // EXPLICIT CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Max-Age', '86400');
    res.header('Cache-Control', 'public, max-age=31536000');
    
    const filePath = path.join(__dirname, '../public/uploads', folder, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Read and send file with proper content-type
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading file' });
      }
      
      // Set content-type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      };
      
      res.header('Content-Type', contentTypes[ext] || 'application/octet-stream');
      res.send(data);
    });
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
import produitRoutes from './routes/produits.js';
import whatsappRoutes from './routes/whatsapp.js';

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
app.use('/api/produits', produitRoutes);
app.use('/api/whatsapp', whatsappRoutes);

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
