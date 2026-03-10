import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dataDir, 'cathy-decor.db'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true
  }
});

// Test connection
export const connectDB = async () => {
  try {
    console.log('🔌 Attempting database connection...');
    await sequelize.authenticate();
    console.log('✅ SQLite Database Connected');
    
    // Import ALL models AFTER sequelize is initialized
    try {
      console.log('📦 Loading User model...');
      await import('../models/User.js');
    } catch (error) {
      console.error('❌ User model error:', error.message);
      throw error;
    }
    
    try {
      console.log('📦 Loading Decoration model...');
      await import('../models/Decoration.js');
    } catch (error) {
      console.error('❌ Decoration model error:', error.message);
      throw error;
    }
    
    try {
      console.log('📦 Loading Salle model...');
      await import('../models/Salle.js');
    } catch (error) {
      console.error('❌ Salle model error:', error.message);
      throw error;
    }
    
    try {
      console.log('📦 Loading Commande model...');
      await import('../models/Commande.js');
    } catch (error) {
      console.error('❌ Commande model error:', error.message);
      throw error;
    }
    
    try {
      console.log('📦 Loading Testimonial model...');
      await import('../models/Testimonial.js');
    } catch (error) {
      console.error('❌ Testimonial model error:', error.message);
      throw error;
    }
    
    try {
      console.log('📦 Loading Favorite model...');
      await import('../models/Favorite.js');
    } catch (error) {
      console.error('❌ Favorite model error:', error.message);
      throw error;
    }
    
    console.log('🔄 Synchronizing database models...');
    // Force sync in production to ensure table exists  
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database Models Synchronized');
  } catch (error) {
    console.error('❌ Database Connection Error:', error);
    process.exit(1);
  }
};

export default sequelize;
