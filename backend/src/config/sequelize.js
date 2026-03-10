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
    await sequelize.authenticate();
    console.log('✅ SQLite Database Connected');
    
    // Import ALL models AFTER sequelize is initialized
    const { default: User } = await import('../models/User.js');
    const { default: Decoration } = await import('../models/Decoration.js');
    const { default: Salle } = await import('../models/Salle.js');
    const { default: Commande } = await import('../models/Commande.js');
    const { default: Testimonial } = await import('../models/Testimonial.js');
    const { default: Favorite } = await import('../models/Favorite.js');
    
    // Sync all models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database Models Synchronized');
  } catch (error) {
    console.error('❌ Database Connection Error:', error);
    process.exit(1);
  }
};

export default sequelize;
