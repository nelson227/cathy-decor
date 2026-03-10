import express from 'express';

const router = express.Router();

// Services data - synchronized with frontend Services.jsx
const servicesData = [
  {
    id: 1,
    name: 'Mariage',
    slug: 'mariage',
    image: '/images/services/mariage.png',
    description: 'Services spécialisés pour créer la décoration de votre jour parfait.',
    includes: ['Décor salle', 'Table de mariage', 'Arche florale', 'Détails personnalisés']
  },
  {
    id: 2,
    name: 'Anniversaire',
    slug: 'anniversaire',
    image: '/images/services/anniversaire.png',
    description: 'Décoration festive et élégante pour célébrer vos moments spéciaux.',
    includes: ['Thématique personnalisée', 'Installation complète', 'Coordination', 'Démontage']
  },
  {
    id: 3,
    name: 'Baptême',
    slug: 'bapteme',
    image: '/images/services/bapteme.png',
    description: 'Services délicats et gracieux pour marquer cette belle occasion.',
    includes: ['Décor salle', 'Arrangements floraux', 'Éclairage doux', 'Mise en place']
  },
  {
    id: 4,
    name: 'Funéraires',
    slug: 'funeraires',
    image: '/images/services/funeraires.png',
    description: 'Services respectueux et dignifiés pour les cérémonies funéraires.',
    includes: ['Arrangement floral', 'Éclairage sobre', 'Draperies', 'Coordination']
  }
];

// GET all services
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    let filtered = [...servicesData];

    // Filter by category
    if (category) {
      filtered = filtered.filter(service => service.category === category);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower)
      );
    }

    const skip = (page - 1) * limit;
    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    res.json({
      success: true,
      data: paginated,
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

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = servicesData.find(s => s.id === Number(req.params.id));

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET service by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const service = servicesData.find(s => s.slug === req.params.slug);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
