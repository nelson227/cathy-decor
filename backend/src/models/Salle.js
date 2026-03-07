import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Salle = sequelize.define('Salle', {
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
  city: DataTypes.STRING,
  address: DataTypes.STRING,
  capacityMin: DataTypes.INTEGER,
  capacityMax: DataTypes.INTEGER,
  price: DataTypes.DECIMAL(10, 2),
  image: DataTypes.STRING,
  amenities: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  parking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ac: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  kitchen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  outdoor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  wifi: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  accessibility: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'salles',
  paranoid: true
});

export default Salle;
