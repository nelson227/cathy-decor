import express from 'express';
import Decoration from '../models/Decoration.js';
import Salle from '../models/Salle.js';
import Commande from '../models/Commande.js';
import User from '../models/User.js';

const router = express.Router();

// GET dashboard stats
router.get('/', async (req, res) => {
  try {
    // Count total decorations
    const totalDecorations = await Decoration.count();

    // Count total salles
    const totalSalles = await Salle.count();

    // Count total orders
    const totalOrders = await Commande.count();

    // Count total users
    const totalUsers = await User.count();

    // Revenue from orders
    const orderStats = await Commande.findAll({
      attributes: [
        ['totalAmount', 'revenue']
      ]
    });

    const totalRevenue = orderStats.reduce((sum, order) => {
      return sum + (order.dataValues.revenue || 0);
    }, 0);

    // Recent orders
    const recentOrders = await Commande.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    // Orders by status
    const ordersByStatus = await Commande.findAll({
      attributes: [
        'status',
        ['sequelize.fn("COUNT", sequelize.col("id"))', 'count']
      ],
      group: ['status'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalDecorations,
          totalSalles,
          totalOrders,
          totalUsers,
          totalRevenue: totalRevenue || 0
        },
        recentOrders,
        ordersByStatus: ordersByStatus || [],
        charts: {
          revenue: [],
          orders: []
        }
      }
    });
  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
});

export default router;
