import sequelize from '../src/config/sequelize.js';
import User from '../src/models/User.js';

const check = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const users = await User.findAll();
    console.log(`\n📊 Total users: ${users.length}`);

    users.forEach(u => {
      console.log(`\n👤 User:`);
      console.log(`   ID: ${u.id}`);
      console.log(`   Email: ${u.email}`);
      console.log(`   Name: ${u.name}`);
      console.log(`   Role: ${u.role}`);
      console.log(`   Active: ${u.active}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

check();
