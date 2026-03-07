import express from 'express';

const router = express.Router();

// Mock services data - will be replaced with Service model/database
const servicesData = [
  {
    id: 1,
    name: 'Décoration Événement',
    slug: 'decoration-evenement',
    description: 'Décoration complète pour tous types d\'événements',
    image: '/images/services/decoration.jpg',
    price: 500,
    duration: '4-8 heures',
    included: ['Arrangement floral', 'Éclairage', 'Mise en place'],
    category: 'decoration'
  },
  {
    id: 2,
    name: 'Organisation d\'événement',
    slug: 'organisation-evenement',
    description: 'Planification et gestion complète de votre événement',
    image: '/images/services/organisation.jpg',
    price: 800,
    duration: 'Variable',
    included: ['Coordination', 'Gestion du budget', 'Logistique'],
    category: 'organisation'
  },
  {
    id: 3,
    name: 'Décoration Mariage',
    slug: 'decoration-mariage',
    description: 'Décoration spécialisée pour mariages de rêve',
    image: '/images/services/mariage.jpg',
    price: 1200,
    duration: '6-10 heures',
    included: ['Thème personnalisé', 'Salle décorée', 'Photobooth'],
    category: 'mariage'
  },
  {
    id: 4,
    name: 'Services Funéraires',
    slug: 'services-funeraires',
    description: 'Hommage respectueux et décoration adaptée',
    image: '/images/services/funeraire.jpg',
    price: 600,
    duration: '2-4 heures',
    included: ['Arrangement floral', 'Draperie', 'Mise en place'],
    category: 'funeraire'
  },
  {
    id: 5,
    name: 'Traiteur - Buffet',
    slug: 'traiteur-buffet',
    description: 'Buffet gastronomique personnalisé pour vos événements',
    image: '/images/services/buffet.jpg',
    price: 40,
    duration: 'À la personne',
    included: ['3 entrées', '3 plats', '3 desserts', 'Boissons'],
    category: 'catering',
    perPerson: true
  },
  {
    id: 6,
    name: 'Traiteur - Cocktail',
    slug: 'traiteur-cocktail',
    description: 'Service de cocktail avec drinks et petits fours',
    image: '/images/services/cocktail.jpg',
    price: 25,
    duration: 'À la personne',
    included: ['Petits fours', 'Drinks', 'Service complet'],
    category: 'catering',
    perPerson: true
  },
  {
    id: 7,
    name: 'Location d\'équipement',
    slug: 'location-equipement',
    description: 'Location de tables, chaises, vaisselle et décoration',
    image: '/images/services/equipement.jpg',
    price: 2000,
    duration: 'À la journée',
    included: ['Tables', 'Chaises', 'Nappes', 'Vaisselle', 'Verres'],
    category: 'equipment'
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
