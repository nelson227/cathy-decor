import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Produit = sequelize.define('Produit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['mariage', 'anniversaire', 'bapteme', 'funeraire', 'corporate', 'exterieur', 'interieur']]
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'produits',
  timestamps: true
});

export default Produit;
