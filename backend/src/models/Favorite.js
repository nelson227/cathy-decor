import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  itemId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  itemType: {
    type: DataTypes.ENUM('decoration', 'salle', 'service'),
    allowNull: false
  }
}, {
  tableName: 'favorites',
  paranoid: true
});

export default Favorite;
