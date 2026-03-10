import express from 'express';
import { Op } from 'sequelize';
import Produit from '../models/Produit.js';

const router = express.Router();

// GET all produits
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 24 } = req.query;

    let where = { available: true };

    if (category && category !== 'tous') {
      where.category = category;
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows: produits } = await Produit.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: produits,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single produit
router.get('/:id', async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }
    res.json({ success: true, data: produit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE produit (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, category, price, description, images } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Nom, catégorie et prix sont obligatoires'
      });
    }

    const produit = await Produit.create({
      name,
      category,
      price,
      description,
      images: images || []
    });

    res.status(201).json({ success: true, data: produit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE produit (admin only)
router.put('/:id', async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);

    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    await produit.update({ ...req.body, updatedAt: new Date() });
    await produit.reload();

    res.json({ success: true, data: produit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE produit (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);

    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    await produit.destroy();

    res.json({ success: true, message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
