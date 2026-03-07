import express from 'express';
import Commande from '../models/Commande.js';

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Commande.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes',
      error: error.message
    });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id);
    
    if (!commande) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.json({
      success: true,
      data: commande
    });
  } catch (error) {
    console.error('❌ Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande'
    });
  }
});

// CREATE new order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, totalAmount } = req.body;

    if (!customerName || !customerEmail || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Données manquantes'
      });
    }

    const commande = await Commande.create({
      customerName,
      customerEmail,
      customerPhone,
      items: JSON.stringify(items),
      totalAmount: totalAmount || 0,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: commande,
      message: 'Commande créée avec succès'
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande'
    });
  }
});

// UPDATE order status
router.put('/:id', async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id);
    
    if (!commande) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    await commande.update(req.body);

    res.json({
      success: true,
      data: commande,
      message: 'Commande mise à jour'
    });
  } catch (error) {
    console.error('❌ Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Commande.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Commande supprimée'
    });
  } catch (error) {
    console.error('❌ Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
});

export default router;
