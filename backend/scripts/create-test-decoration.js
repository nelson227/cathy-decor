import sequelize from '../src/config/sequelize.js';
import Decoration from '../src/models/Decoration.js';

const testDecoration = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Create test decoration
    const decoration = await Decoration.create({
      name: 'Mariage Test',
      slug: 'mariage-test',
      category: 'mariage',
      theme: 'Romantique',
      description: 'Ceci est une décoration de mariage test pour vérifier si le portfolio fonctionne. Elle contient des fleurs roses et une ambiance romantique.',
      shortDescription: 'Décoration de mariage test',
      images: [
        '/uploads/decorations/test-image-1.jpg',
        '/uploads/decorations/test-image-2.jpg'
      ],
      price: 1500,
      colors: ['#E8A9C6', '#F5F5F5', '#8B4369'],
      options: [
        { name: 'Nombre d\'invités', value: '50-100' },
        { name: 'Durée', value: '4 heures' }
      ],
      included: ['Fleurs', 'Nappes', 'Bougies']
    });

    console.log('✅ Test decoration created:');
    console.log(JSON.stringify(decoration, null, 2));
    console.log('\n📋 Check your portfolio now to see if this decoration appears!');
    console.log('If it appears but images don\'t load, there\'s a CORS issue.');
    console.log('If it doesn\'t appear at all, there\'s a fetching issue.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test decoration:', error);
    process.exit(1);
  }
};

testDecoration();
