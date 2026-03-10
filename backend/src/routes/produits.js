import express from 'express';
import { Op } from 'sequelize';
import Produit from '../models/Produit.js';

const router = express.Router();

// GET all produits with advanced filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      priceMin, 
      priceMax, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC',
      page = 1, 
      limit = 24 
    } = req.query;

    let where = { available: true };

    // Category filter
    if (category && category !== 'tous') {
      where.category = category;
    }

    // Search filter
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Price range filter
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price[Op.gte] = Number(priceMin);
      if (priceMax) where.price[Op.lte] = Number(priceMax);
    }

    // Sorting options
    let order;
    switch (sortBy) {
      case 'price-asc':
        order = [['price', 'ASC']];
        break;
      case 'price-desc':
        order = [['price', 'DESC']];
        break;
      case 'name-asc':
        order = [['name', 'ASC']];
        break;
      case 'name-desc':
        order = [['name', 'DESC']];
        break;
      case 'newest':
        order = [['createdAt', 'DESC']];
        break;
      case 'featured':
        order = [['featured', 'DESC'], ['createdAt', 'DESC']];
        break;
      default:
        order = [['featured', 'DESC'], ['createdAt', 'DESC']];
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows: produits } = await Produit.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order
    });

    // Get category counts
    const categoryCounts = await Produit.findAll({
      attributes: [
        'category',
        [Produit.sequelize.fn('COUNT', Produit.sequelize.col('id')), 'count']
      ],
      where: { available: true },
      group: ['category'],
      raw: true
    });

    res.json({
      success: true,
      data: produits,
      categoryCounts,
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
    const { name, category, price, description, shortDescription, images, characteristics, requiresSelection, stock, featured } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Nom, catégorie et prix sont obligatoires'
      });
    }

    // Déterminer automatiquement si le produit requiert une sélection
    const hasCharacteristics = characteristics && Object.keys(characteristics).length > 0;
    const needsSelection = requiresSelection !== undefined ? requiresSelection : hasCharacteristics;

    const produit = await Produit.create({
      name,
      category,
      price,
      description,
      shortDescription,
      images: images || [],
      characteristics: characteristics || {},
      requiresSelection: needsSelection,
      stock: stock !== undefined ? stock : -1,
      featured: featured || false
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

    const updateData = { ...req.body, updatedAt: new Date() };
    
    // Recalculer requiresSelection si characteristics a changé
    if (req.body.characteristics !== undefined) {
      const hasCharacteristics = req.body.characteristics && Object.keys(req.body.characteristics).length > 0;
      if (req.body.requiresSelection === undefined) {
        updateData.requiresSelection = hasCharacteristics;
      }
    }

    await produit.update(updateData);
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
