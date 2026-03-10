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
  shortDescription: DataTypes.STRING,
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['buffets-rechauds', 'couverts', 'decoration-table', 'mobilier', 'structures-chapiteaux', 'vaisselle-verrerie', 'autres']]
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
  // Caractéristiques dynamiques - définies par l'admin
  // Format: { "couleur": ["Argent", "Or", "Noir"], "modele": ["Standard", "Premium"] }
  characteristics: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  // Indique si le produit requiert de sélectionner des caractéristiques avant ajout au panier
  requiresSelection: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: -1 // -1 = illimité
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'produits',
  timestamps: true,
  indexes: [
    { fields: ['category'] },
    { fields: ['price'] },
    { fields: ['available'] },
    { fields: ['featured'] }
  ]
});

export default Produit;
