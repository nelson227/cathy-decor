import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// Helper to generate slug
const generateSlug = (name) => {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
};

// SETUP - Initialize default services if empty (MUST BE BEFORE /:id routes)
router.post('/setup-default-services', async (req, res) => {
  try {
    console.log('🌱 Setup default services');

    const count = await Service.count();
    
    if (count > 0) {
      return res.json({
        success: true,
        message: 'Services already initialized',
        count
      });
    }

    const defaultServices = [
      {
        name: 'Mariage',
        slug: 'mariage',
        image: '/images/services/mariage.png',
        description: 'Services spécialisés pour créer la décoration de votre jour parfait.',
        includes: ['Décor salle', 'Table de mariage', 'Arche florale', 'Détails personnalisés']
      },
      {
        name: 'Anniversaire',
        slug: 'anniversaire',
        image: '/images/services/anniversaire.png',
        description: 'Décoration festive et élégante pour célébrer vos moments spéciaux.',
        includes: ['Thématique personnalisée', 'Installation complète', 'Coordination', 'Démontage']
      },
      {
        name: 'Baptême',
        slug: 'bapteme',
        image: '/images/services/bapteme.png',
        description: 'Services délicats et gracieux pour marquer cette belle occasion.',
        includes: ['Décor salle', 'Arrangements floraux', 'Éclairage doux', 'Mise en place']
      },
      {
        name: 'Funéraires',
        slug: 'funeraires',
        image: '/images/services/funeraires.png',
        description: 'Services respectueux et dignifiés pour les cérémonies funéraires.',
        includes: ['Arrangement floral', 'Éclairage sobre', 'Draperies', 'Coordination']
      }
    ];

    const created = [];
    for (const serviceData of defaultServices) {
      const service = await Service.create(serviceData);
      created.push({
        id: service.id,
        name: service.name,
        slug: service.slug
      });
      console.log('✅ Created:', service.name);
    }

    console.log('✅ Setup complete:', created.length, 'services');

    res.json({
      success: true,
      message: 'Default services initialized',
      created
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all services
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;

    let where = { active: true };

    // Filter by search
    if (search) {
      const { Op } = require('sequelize');
      where = {
        ...where,
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const skip = (page - 1) * limit;

    const { count, rows } = await Service.findAndCountAll({
      where,
      limit: Number(limit),
      offset: skip,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows.map(s => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        image: s.image,
        description: s.description,
        includes: Array.isArray(s.includes) ? s.includes : []
      })),
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('GET /services error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service || !service.active) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }

    res.json({
      success: true,
      data: {
        id: service.id,
        name: service.name,
        slug: service.slug,
        image: service.image,
        description: service.description,
        includes: Array.isArray(service.includes) ? service.includes : []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET service by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({
      where: { slug: req.params.slug, active: true }
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }

    res.json({
      success: true,
      data: {
        id: service.id,
        name: service.name,
        slug: service.slug,
        image: service.image,
        description: service.description,
        includes: Array.isArray(service.includes) ? service.includes : []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Create service (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, description, includes = [], image } = req.body;

    console.log('📝 Creating service:', name);

    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Name and description required' });
    }

    const slug = generateSlug(name);

    const service = await Service.create({
      name,
      slug,
      description,
      includes: Array.isArray(includes) ? includes : [],
      image,
      active: true
    });

    console.log('✅ Service created:', service.id);

    res.status(201).json({
      success: true,
      message: 'Service créé avec succès',
      data: {
        id: service.id,
        name: service.name,
        slug: service.slug,
        image: service.image,
        description: service.description,
        includes: Array.isArray(service.includes) ? service.includes : []
      }
    });
  } catch (error) {
    console.error('POST /services error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Update service (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, includes = [], image } = req.body;

    console.log('✏️ Updating service:', id);

    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await service.update({
      name: name || service.name,
      description: description || service.description,
      includes: Array.isArray(includes) ? includes : service.includes,
      image: image || service.image
    });

    console.log('✅ Service updated:', id);

    res.json({
      success: true,
      message: 'Service modifié avec succès',
      data: {
        id: service.id,
        name: service.name,
        slug: service.slug,
        image: service.image,
        description: service.description,
        includes: Array.isArray(service.includes) ? service.includes : []
      }
    });
  } catch (error) {
    console.error('PUT /services/:id error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE - Delete service (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting service:', id);

    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Soft delete
    await service.update({ active: false });

    console.log('✅ Service deleted:', id);

    res.json({
      success: true,
      message: 'Service supprimé avec succès'
    });
  } catch (error) {
    console.error('DELETE /services/:id error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
