import express from 'express';
import Favorite from '../models/Favorite.js';

const router = express.Router();

// ADD to favorites
router.post('/', async (req, res) => {
  try {
    const { userId, itemId, itemType } = req.body;

    // Validation
    if (!userId || !itemId || !itemType) {
      return res.status(400).json({
        success: false,
        message: 'userId, itemId et itemType sont obligatoires'
      });
    }

    if (!['decoration', 'salle', 'service'].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: 'itemType doit être: decoration, salle ou service'
      });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({ userId, itemId, itemType });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Élément déjà en favoris'
      });
    }

    const favorite = new Favorite({
      userId,
      itemId,
      itemType
    });

    await favorite.save();

    res.status(201).json({
      success: true,
      data: favorite,
      message: 'Ajouté aux favoris'
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET user's favorites
router.get('/user/:userId', async (req, res) => {
  try {
    const { itemType, page = 1, limit = 12 } = req.query;

    let query = { userId: req.params.userId };
    if (itemType) {
      query.itemType = itemType;
    }

    const skip = (page - 1) * limit;
    const favorites = await Favorite.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Favorite.countDocuments(query);

    res.json({
      success: true,
      data: favorites,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CHECK if item is favorited
router.get('/:userId/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { itemType } = req.query;

    if (!itemType) {
      return res.status(400).json({
        success: false,
        message: 'itemType requis'
      });
    }

    const favorite = await Favorite.findOne({
      userId,
      itemId,
      itemType
    });

    res.json({
      success: true,
      exist: !!favorite,
      data: favorite || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// REMOVE from favorites
router.delete('/:userId/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { itemType } = req.query;

    if (!itemType) {
      return res.status(400).json({
        success: false,
        message: 'itemType requis'
      });
    }

    const favorite = await Favorite.findOneAndDelete({
      userId,
      itemId,
      itemType
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favori non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Retiré des favoris'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET count of favorites for item
router.get('/count/:itemId', async (req, res) => {
  try {
    const { itemType } = req.query;

    if (!itemType) {
      return res.status(400).json({
        success: false,
        message: 'itemType requis'
      });
    }

    const count = await Favorite.countDocuments({
      itemId: req.params.itemId,
      itemType
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
