import express from 'express';
import Salle from '../models/Salle.js';
import { Op } from 'sequelize';

const router = express.Router();

// GET all salles
router.get('/', async (req, res) => {
  try {
    const { city, capacityMin, capacityMax, page = 1, limit = 12 } = req.query;

    let where = {};

    if (city) {
      where.city = {
        [Op.like]: `%${city}%`
      };
    }

    if (capacityMin || capacityMax) {
      if (capacityMin) {
        where.capacityMin = {
          [Op.gte]: parseInt(capacityMin)
        };
      }
      if (capacityMax) {
        where.capacityMax = {
          [Op.lte]: parseInt(capacityMax)
        };
      }
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Salle.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
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
    console.error('❌ Get salles error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des salles',
      error: error.message
    });
  }
});

// GET single salle
router.get('/:id', async (req, res) => {
  try {
    const salle = await Salle.findByPk(req.params.id);
    
    if (!salle) {
      return res.status(404).json({
        success: false,
        message: 'Salle non trouvée'
      });
    }

    res.json({
      success: true,
      data: salle
    });
  } catch (error) {
    console.error('❌ Get salle error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la salle'
    });
  }
});

// CREATE new salle
router.post('/', async (req, res) => {
  try {
    const { name, description, city, address, capacityMin, capacityMax, price, images, parking, ac, kitchen, outdoor, wifi, accessibility } = req.body;

    console.log('Creating salle with:', { name, city, capacityMin, capacityMax });

    if (!name || !city) {
      return res.status(400).json({
        success: false,
        message: 'Nom et ville sont obligatoires'
      });
    }

    const salle = await Salle.create({
      name,
      description,
      city,
      address,
      capacityMin: parseInt(capacityMin) || 0,
      capacityMax: parseInt(capacityMax) || 0,
      price: parseFloat(price) || 0,
      images: images || [],
      parking: parking || false,
      ac: ac || false,
      kitchen: kitchen || false,
      outdoor: outdoor || false,
      wifi: wifi || false,
      accessibility: accessibility || false
    });

    res.status(201).json({
      success: true,
      data: salle,
      message: 'Salle créée avec succès'
    });
  } catch (error) {
    console.error('❌ Create salle error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création'
    });
  }
});

// UPDATE salle
router.put('/:id', async (req, res) => {
  try {
    const salle = await Salle.findByPk(req.params.id);
    
    if (!salle) {
      return res.status(404).json({
        success: false,
        message: 'Salle non trouvée'
      });
    }

    await salle.update(req.body);

    res.json({
      success: true,
      data: salle,
      message: 'Salle mise à jour'
    });
  } catch (error) {
    console.error('❌ Update salle error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    });
  }
});

// DELETE salle
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Salle.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Salle non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Salle supprimée'
    });
  } catch (error) {
    console.error('❌ Delete salle error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
});

export default router;
