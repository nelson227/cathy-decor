import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

// CREATE testimonial
router.post('/', async (req, res) => {
  try {
    const { author, content, rating, eventType, image } = req.body;

    // Validation
    if (!author || !content || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Auteur, contenu et note sont obligatoires'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La note doit être entre 1 et 5'
      });
    }

    const testimonial = new Testimonial({
      author,
      content,
      rating,
      eventType: eventType || 'autre',
      image: image || '/images/avatars/default.jpg',
      verified: false
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Témoignage créé (en attente de vérification)'
    });
  } catch (error) {
    console.error('Testimonial creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all verified testimonials
router.get('/', async (req, res) => {
  try {
    const { limit = 6, sort = '-createdAt' } = req.query;

    const testimonials = await Testimonial.find({ verified: true })
      .sort(sort)
      .limit(Number(limit));

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single testimonial
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Témoignage non trouvé'
      });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE testimonial (admin - to verify)
router.put('/:id', async (req, res) => {
  try {
    const { verified, author, content, rating } = req.body;

    const updates = {};
    if (verified !== undefined) updates.verified = verified;
    if (author) updates.author = author;
    if (content) updates.content = content;
    if (rating) updates.rating = rating;

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Témoignage non trouvé'
      });
    }

    res.json({
      success: true,
      data: testimonial,
      message: 'Témoignage mis à jour'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE testimonial (admin)
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Témoignage non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Témoignage supprimé'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET testimonials by event type (public)
router.get('/event/:eventType', async (req, res) => {
  try {
    const { limit = 3 } = req.query;

    const testimonials = await Testimonial.find({
      verified: true,
      eventType: req.params.eventType
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
