#!/usr/bin/env node

import sequelize from '../src/config/sequelize.js';
import Service from '../src/models/Service.js';

const seedServices = async () => {
  try {
    console.log('🌱 Seeding services...');
    
    // Connect
    await sequelize.authenticate();
    console.log('✅ Database Connected');
    
    // Sync
    await sequelize.sync({ alter: true });
    console.log('✅ Models Synchronized');

    // Default services
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

    // Check and create services
    for (const serviceData of defaultServices) {
      const exists = await Service.findOne({ where: { slug: serviceData.slug } });
      
      if (!exists) {
        await Service.create(serviceData);
        console.log(`✅ Created service: ${serviceData.name}`);
      } else {
        console.log(`⏭️ Service already exists: ${serviceData.name}`);
      }
    }

    console.log('\n✅ Services seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedServices();
