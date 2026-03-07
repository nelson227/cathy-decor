/**
 * Database Seeder Script
 * Popule la Base de Données avec données initiales
 * 
 * Usage: node scripts/seed.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';

// Load env
dotenv.config();

// Import Models
import User from '../src/models/User.js';
import Decoration from '../src/models/Decoration.js';
import Salle from '../src/models/Salle.js';
import Testimonial from '../src/models/Testimonial.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cathy-decor';

// Sample Data
const adminUsers = [
  {
    email: 'admin@cathyDecor.com',
    password: 'Admin123',
    name: 'Administrateur',
    role: 'admin',
    active: true
  }
];

const decorations = [
  {
    name: 'Décoration Mariage Élégante',
    slug: 'decoration-mariage-elegante',
    category: 'mariage',
    theme: 'romantique',
    colors: ['rose', 'blanc', 'or'],
    description: 'Décoration mariage complète avec fleurs fraîches, arches, nappes personnalisées et éclairage ambiance',
    shortDescription: 'Mariage rêve avec roses et or',
    price: 1200,
    rating: 4.8,
    reviewCount: 24,
    stock: 5,
    images: ['/images/decorations/mariage-1.jpg'],
    duration: '6-8 heures',
    options: ['Fleurs fraîches', 'Lumière LED', 'Arche personnalisée'],
    included: ['Arrangement floral', 'Nappes', 'Éclairage', 'Livraison']
  },
  {
    name: 'Anniversaire Arc-en-Ciel',
    slug: 'anniversaire-arc-en-ciel',
    category: 'anniversaire',
    theme: 'coloré',
    colors: ['rouge', 'jaune', 'bleu', 'vert'],
    description: 'Décoration anniversaire amusante avec ballons, guirlandes et thème coloré pour tous les âges',
    shortDescription: 'Anniversaire festif et coloré',
    price: 450,
    rating: 4.6,
    reviewCount: 18,
    stock: 10,
    images: ['/images/decorations/anniversaire-1.jpg'],
    duration: '3-4 heures',
    options: ['Ballons géants', 'Gâteau décor', 'Guirlandes LED'],
    included: ['Ballons', 'Nappes', 'Centerpieces']
  },
  {
    name: 'Baby Shower Paradise',
    slug: 'baby-shower-paradise',
    category: 'baby-shower',
    theme: 'pastel',
    colors: ['rose pâle', 'bleu pâle', 'blanc'],
    description: 'Décoration baby shower douce avec pastels, arches et thème personnalisé pour célébrer l\'arrivée',
    shortDescription: 'Baby shower douces pastels',
    price: 550,
    rating: 4.7,
    reviewCount: 15,
    stock: 8,
    images: ['/images/decorations/baby-shower-1.jpg'],
    duration: '4-5 heures',
    options: ['Arche personnalisée', 'Ciel étoilé', 'Photobooth'],
    included: ['Arche', 'Ballons', 'Nappes', 'Centerpieces']
  },
  {
    name: 'Baptême Traditionnel',
    slug: 'bapteme-traditionnel',
    category: 'bapteme',
    theme: 'religieux',
    colors: ['blanc', 'or', 'crème'],
    description: 'Décoration baptême élégante avec éléments religieux et fleurs blanches traditionnelles',
    shortDescription: 'Baptême blanc et or',
    price: 600,
    rating: 4.5,
    reviewCount: 12,
    stock: 6,
    images: ['/images/decorations/bapteme-1.jpg'],
    duration: '5-6 heures',
    options: ['Cartes personnalisées', 'Lieu de cérémonie', 'Photo backdrop'],
    included: ['Fleurs', 'Nappes', 'Panneaux']
  },
  {
    name: 'Cérémonie Funéraire Respectueuse',
    slug: 'ceremonie-funeraire',
    category: 'funeraire',
    theme: 'sobre',
    colors: ['blanc', 'noir', 'gris'],
    description: 'Décoration funéraire respectueuse avec chrysanthèmes, draperie noire et ambiance solennel',
    shortDescription: 'Hommage respectueux et digne',
    price: 600,
    rating: 4.9,
    reviewCount: 8,
    stock: 4,
    images: ['/images/decorations/funeraire-1.jpg'],
    duration: '2-4 heures',
    options: ['Chrysanthèmes', 'Draperie noire', 'Musique ambiance'],
    included: ['Fleurs', 'Draperie', 'Éclairage discret']
  },
  {
    name: 'Événement Corporate Premium',
    slug: 'event-corporate-premium',
    category: 'corporate',
    theme: 'professionnel',
    colors: ['gris', 'noir', 'blanc'],
    description: 'Décoration événement corporate avec branding, podium et setup professionnel pour conférences',
    shortDescription: 'Corporate élégant et efficace',
    price: 1500,
    rating: 4.7,
    reviewCount: 22,
    stock: 3,
    images: ['/images/decorations/corporate-1.jpg'],
    duration: '8-10 heures',
    options: ['Logo géant', 'Podium éclairé', 'Setup technologie'],
    included: ['Branding', 'Tables professionnelles', 'Signalétique']
  },
  {
    name: 'Jardin Extérieur Paradis',
    slug: 'jardin-exterieur-paradis',
    category: 'exterieur',
    theme: 'naturel',
    colors: ['vert', 'blanc', 'or'],
    description: 'Décoration extérieur avec plantes, chaises blanches et abri parasol pour jardins',
    shortDescription: 'Jardin féerique en plein air',
    price: 800,
    rating: 4.6,
    reviewCount: 11,
    stock: 5,
    images: ['/images/decorations/jardin-1.jpg'],
    duration: '6-8 heures',
    options: ['Chapiteau', 'Chaises design', 'Lumière guirlande'],
    included: ['Plantes', 'Chaises', 'Abri']
  },
  {
    name: 'Salle Intérieur Luxe',
    slug: 'salle-interieur-luxe',
    category: 'interieur',
    theme: 'luxe',
    colors: ['or', 'noir', 'rouge'],
    description: 'Décoration salle intérieur haut de gamme avec cristaux, chandeliers et tapis rouge',
    shortDescription: 'Salle intérieur ultra luxe',
    price: 1800,
    rating: 4.8,
    reviewCount: 19,
    stock: 4,
    images: ['/images/decorations/salle-interieur-1.jpg'],
    duration: '8-10 heures',
    options: ['Lustres cristal', 'Tapis rouge', 'Colonnes dorées'],
    included: ['Tous éléments de décor', 'Montage/démontage']
  }
];

const salles = [
  {
    name: 'Salle Royal Palace',
    slug: 'salle-royal-palace',
    description: 'Magnifique salle de réception avec capacité de 200-500 personnes, aire climatisée, parking gratuit',
    images: ['/images/salles/royal-palace.jpg'],
    location: {
      city: 'Casablanca',
      address: '123 Boulevard Mohammed V',
      coordinates: [-7.5898, 33.5731]
    },
    capacity: {
      min: 200,
      max: 500
    },
    pricePerDay: 5000,
    pricePerHour: 300,
    amenities: ['climatisation', 'parking gratuit', 'cuisines', 'toilettes VIP'],
    parking: true,
    ac: true,
    kitchen: true,
    outdoor: false,
    wifi: true,
    accessibility: true,
    contact: {
      phone: '+212661234567',
      email: 'contact@royalpalace.ma'
    }
  },
  {
    name: 'Villa Méridien',
    slug: 'villa-meridien',
    description: 'Villa luxueuse avec jardin privé, piscine, terrasse vue mer pour mariages et réceptions',
    images: ['/images/salles/villa-meridien.jpg'],
    location: {
      city: 'Marrakech',
      address: 'Route du Nfis',
      coordinates: [-8.0100, 31.6295]
    },
    capacity: {
      min: 50,
      max: 350
    },
    pricePerDay: 7000,
    pricePerHour: 400,
    amenities: ['piscine', 'jardin privatisé', 'terrasse', 'vue montagne'],
    parking: true,
    ac: true,
    kitchen: true,
    outdoor: true,
    wifi: true,
    accessibility: false,
    contact: {
      phone: '+212671234567',
      email: 'contact@villameridien.ma'
    }
  },
  {
    name: 'Hôtel Les Jardins',
    slug: 'hotel-les-jardins',
    description: 'Hôtel 4 étoiles avec salles de conférence, restaurant, bar et chambres pour invités',
    images: ['/images/salles/hotel-jardins.jpg'],
    location: {
      city: 'Fès',
      address: '45 Avenue Hassan II',
      coordinates: [-5.0145, 34.0674]
    },
    capacity: {
      min: 100,
      max: 400
    },
    pricePerDay: 4000,
    pricePerHour: 250,
    amenities: ['restaurant', 'bar', 'chambres hôtel', 'service complet'],
    parking: true,
    ac: true,
    kitchen: true,
    outdoor: false,
    wifi: true,
    accessibility: true,
    contact: {
      phone: '+212531234567',
      email: 'contact@lesjardins.ma'
    }
  },
  {
    name: 'Château des Vignes',
    slug: 'chateau-vignes',
    description: 'Château médiéval avec cour intérieure, caves historiques pour mariages de conte de fées',
    images: ['/images/salles/chateau-vignes.jpg'],
    location: {
      city: 'Meknès',
      address: 'Route viticole',
      coordinates: [-5.5500, 33.8869]
    },
    capacity: {
      min: 80,
      max: 300
    },
    pricePerDay: 6000,
    pricePerHour: 350,
    amenities: ['cour intérieure', 'caves historiques', 'terrasse', 'vue panoramique'],
    parking: true,
    ac: false,
    kitchen: true,
    outdoor: true,
    wifi: true,
    accessibility: false,
    contact: {
      phone: '+212551234567',
      email: 'contact@chateauvig.ma'
    }
  },
  {
    name: 'Palais Bleu Nuit',
    slug: 'palais-bleu-nuit',
    description: 'Salle de réception ultra luxe avec décor oriental, hammam, spa pour événements prestigieux',
    images: ['/images/salles/palais-bleu.jpg'],
    location: {
      city: 'Rabat',
      address: 'Quartier Agdal',
      coordinates: [-6.8695, 34.0276]
    },
    capacity: {
      min: 150,
      max: 600
    },
    pricePerDay: 8000,
    pricePerHour: 500,
    amenities: ['hammam', 'spa', 'bar VIP', 'zone VIP'],
    parking: true,
    ac: true,
    kitchen: true,
    outdoor: true,
    wifi: true,
    accessibility: true,
    contact: {
      phone: '+212371234567',
      email: 'contact@palaisbleu.ma'
    }
  },
  {
    name: 'Riad Secret',
    slug: 'riad-secret',
    description: 'Riad traditionnel avec patio intime, fontaine, mosaïques pour événements personnages',
    images: ['/images/salles/riad-secret.jpg'],
    location: {
      city: 'Tétouan',
      address: 'Médina Ancienne',
      coordinates: [-5.3667, 35.5833]
    },
    capacity: {
      min: 30,
      max: 200
    },
    pricePerDay: 2500,
    pricePerHour: 150,
    amenities: ['patio mosaïques', 'fontaine', 'cuisine marocaine', 'ambiance authentique'],
    parking: true,
    ac: false,
    kitchen: true,
    outdoor: false,
    wifi: false,
    accessibility: false,
    contact: {
      phone: '+212391234567',
      email: 'contact@riadsecret.ma'
    }
  }
];

const testimonials = [
  {
    author: 'Fatima & Ahmed',
    content: 'Cathy Décor a transformer notre mariage en rêve devenu réalité. Les fleurs, la lumière, tout était parfait!',
    rating: 5,
    eventType: 'mariage',
    image: '/images/avatars/fatima.jpg',
    verified: true
  },
  {
    author: 'Laila Bennani',
    content: 'Super service pour l\'anniversaire de ma fille. Les enfants ont adoré la décoration colorée et amusante.',
    rating: 5,
    eventType: 'anniversaire',
    image: '/images/avatars/laila.jpg',
    verified: true
  },
  {
    author: 'Dr. Hassan Qadi',
    content: 'Très professionnels. Notre événement corporate était organisé impeccablement avec branding parfait.',
    rating: 5,
    eventType: 'corporate',
    image: '/images/avatars/hassan.jpg',
    verified: true
  },
  {
    author: 'Noor Zemmouri',
    content: 'Baby shower merveilleux! Les pastels, l\'arche personnalisée... J\'en suis ravi. Highly recommended!',
    rating: 4.8,
    eventType: 'baby-shower',
    image: '/images/avatars/noor.jpg',
    verified: true
  },
  {
    author: 'Karim Tahiri',
    content: 'Service funéraire respectueux et digne. Ils ont comprendre l\'importance du moment.',
    rating: 5,
    eventType: 'funeraire',
    image: '/images/avatars/karim.jpg',
    verified: true
  },
  {
    author: 'Amira Bensouda',
    content: 'Baptême sublime! Toute la famille a complimenté la décoration. Merci Cathy Décor!',
    rating: 5,
    eventType: 'bapteme',
    image: '/images/avatars/amira.jpg',
    verified: true
  }
];

/**
 * Seed Database
 */
async function seedDatabase() {
  try {
    console.log('🌱 Démarrage du seeding...\n');

    // Connect to MongoDB
    console.log('🔗 Connexion MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB\n');

    // Clear existing data (optional)
    console.log('🧹 Nettoyage des données existantes...');
    await User.deleteMany({});
    await Decoration.deleteMany({});
    await Salle.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('✅ Données nettoyées\n');

    // Seed Users
    console.log('👤 Seeding utilisateurs...');
    const createdUsers = await User.insertMany(adminUsers);
    console.log(`✅ ${createdUsers.length} utilisateurs créés`);
    createdUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });
    console.log('');

    // Seed Decorations
    console.log('🎨 Seeding décorations...');
    const createdDecorations = await Decoration.insertMany(decorations);
    console.log(`✅ ${createdDecorations.length} décorations créées\n`);

    // Seed Salles
    console.log('🏢 Seeding salles...');
    const createdSalles = await Salle.insertMany(salles);
    console.log(`✅ ${createdSalles.length} salles créées`);
    createdSalles.forEach(salle => {
      console.log(`   - ${salle.name} (${salle.location.city})`);
    });
    console.log('');

    // Seed Testimonials
    console.log('⭐ Seeding témoignages...');
    const createdTestimonials = await Testimonial.insertMany(testimonials);
    console.log(`✅ ${createdTestimonials.length} témoignages créés\n`);

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('✨ SEEDING COMPLÉTÉ AVEC SUCCÈS!');
    console.log('═══════════════════════════════════════');
    console.log(`Total:
    - Utilisateurs: ${createdUsers.length}
    - Décorations: ${createdDecorations.length}
    - Salles: ${createdSalles.length}
    - Témoignages: ${createdTestimonials.length}
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
