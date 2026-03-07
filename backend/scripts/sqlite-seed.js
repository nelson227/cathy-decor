#!/usr/bin/env node

import sequelize, { connectDB } from '../src/config/sequelize.js';
import User from '../src/models/User.js';
import bcryptjs from 'bcryptjs';

// Import all models
import '../src/models/User.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');
    
    // Connect and sync
    await connectDB();

    // Create admin user
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('Admin123', salt);

    const adminUser = await User.create({
      email: 'admin@cathyDecor.com',
      password: hashedPassword,
      name: 'Administrateur',
      role: 'admin',
      active: true
    });

    console.log('✅ Admin user created:', adminUser.email);

    // Create test customer
    const customerPassword = await bcryptjs.hash('Test123', salt);
    const customerUser = await User.create({
      email: 'customer@example.com',
      password: customerPassword,
      name: 'Client Test',
      role: 'customer',
      active: true
    });

    console.log('✅ Customer user created:', customerUser.email);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Admin:    admin@cathyDecor.com / Admin123');
    console.log('   Customer: customer@example.com / Test123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
