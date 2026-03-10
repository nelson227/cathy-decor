import express from 'express';
import { Op } from 'sequelize';
import Decoration from '../models/Decoration.js';

const router = express.Router();

// GET all decorations
router.get('/', async (req, res) => {
  try {
    const { category, theme, priceMin, priceMax, search, page = 1, limit = 12 } = req.query;

    let where = {};

    if (category && category !== 'tous') {
      where.category = category;
    }
    if (theme) {
      where.theme = theme;
    }
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price[Op.gte] = Number(priceMin);
      if (priceMax) where.price[Op.lte] = Number(priceMax);
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows: decorations } = await Decoration.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: decorations,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching decorations:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single decoration
router.get('/:id', async (req, res) => {
  try {
    const decoration = await Decoration.findByPk(req.params.id);

    if (!decoration) {
      return res.status(404).json({ success: false, message: 'Décoration non trouvée' });
    }

    res.json({ success: true, data: decoration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE decoration (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, category, price, description, images, ...rest } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Nom, catégorie et prix sont obligatoires'
      });
    }

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    const decoration = await Decoration.create({
      name,
      slug,
      category,
      price,
      description,
      images: images || [],
      ...rest
    });

    res.status(201).json({ success: true, data: decoration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE decoration (admin only)
router.put('/:id', async (req, res) => {
  try {
    const decoration = await Decoration.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!decoration) {
      return res.status(404).json({ success: false, message: 'Décoration non trouvée' });
    }

    res.json({ success: true, data: decoration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE decoration (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const decoration = await Decoration.findByIdAndDelete(req.params.id);

    if (!decoration) {
      return res.status(404).json({ success: false, message: 'Décoration non trouvée' });
    }

    res.json({ success: true, message: 'Décoration supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
