import sequelize from '../src/config/sequelize.js';
import Decoration from '../src/models/Decoration.js';

const updateTestDecoration = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Find and update the test decoration to use the new image name
    const [updated] = await Decoration.update(
      {
        images: [
          '/uploads/decorations/presse-naturel.jpg',
          '/uploads/decorations/presse-naturel-2.jpg'
        ]
      },
      {
        where: { slug: 'mariage-test' }
      }
    );

    if (updated === 0) {
      console.log('⚠️  No decoration found. Creating new one...');
      
      const decoration = await Decoration.create({
        name: 'Pressé Naturel - Décoration Test',
        slug: 'mariage-test',
        category: 'mariage',
        theme: 'Naturel et Élégant',
        description: 'Décoration test avec l\'image Pressé Naturel pour vérifier le chargement des images depuis Railway.',
        shortDescription: 'Test avec image réelle',
        images: [
          '/uploads/decorations/presse-naturel.jpg',
          '/uploads/decorations/presse-naturel-2.jpg'
        ],
        price: 1500,
        colors: ['#2D5016', '#F5F5F5', '#8B7355'],
      });
      
      console.log('✅ New test decoration created');
    } else {
      console.log('✅ Test decoration updated to use presse-naturel.jpg');
    }

    console.log('\n📋 Important:');
    console.log('Place your "Pressé Naturel" image in:');
    console.log('backend/public/uploads/decorations/presse-naturel.jpg');
    console.log('\n✨ Then reload the portfolio to see it!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateTestDecoration();
