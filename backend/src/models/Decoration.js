import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Decoration = sequelize.define('Decoration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    lowercase: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['mariage', 'anniversaire', 'baby-shower', 'bapteme', 'funeraire', 'corporate', 'exterieur', 'interieur']]
    }
  },
  theme: DataTypes.STRING,
  colors: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  description: DataTypes.TEXT,
  shortDescription: DataTypes.STRING,
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  videos: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  options: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  included: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  duration: DataTypes.STRING,
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: -1
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: { min: 0, max: 5 }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'decorations',
  timestamps: true,
  indexes: [
    { fields: ['category'] },
    { fields: ['slug'] },
    { fields: ['theme'] },
    { fields: ['price'] },
    { fields: ['available'] }
  ]
});

export default Decoration;
