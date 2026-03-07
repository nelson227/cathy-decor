#!/usr/bin/env node

import sequelize from '../src/config/sequelize.js';
import User from '../src/models/User.js';
import bcryptjs from 'bcryptjs';

const seedAdmin = async () => {
  try {
    console.log('🌱 Seeding admin user...');
    
    // Connect
    await sequelize.authenticate();
    console.log('✅ Database Connected');
    
    // Sync WITHOUT force (para evitar migration issues)
    await sequelize.sync({ alter: true });
    console.log('✅ Models Synchronized');

    // Crate admin directly with plain password
    const password = 'Admin123';
    console.log(`📝 Creating admin with password: ${password}`);

    const admin = await User.create({
      email: 'admin@cathyDecor.com',
      password: password,
      name: 'Administrateur',
      role: 'admin',
      active: true
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    
    console.log('\n📝 Test Credentials:');
    console.log('   Email: admin@cathyDecor.com');
    console.log('   Password: Admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
