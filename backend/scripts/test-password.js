#!/usr/bin/env node

import sequelize from '../src/config/sequelize.js';
import User from '../src/models/User.js';
import bcryptjs from 'bcryptjs';

const testPassword = async () => {
  try {
    console.log('🔐 Testing password verification...\n');
    
    // Connect
    await sequelize.authenticate();
    console.log('✅ Database Connected');
    
    // Get admin user
    const user = await User.findOne({ where: { email: 'admin@cathyDecor.com' } });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('👤 User found:');
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    console.log('   Role:', user.role);
    console.log('   Stored Hash:', user.password);
    
    // Test password
    console.log('\n🔑 Testing password "Admin123"...');
    const plainPassword = 'Admin123';
    
    const isValid = await bcryptjs.compare(plainPassword, user.password);
    console.log('   Result:', isValid ? '✅ MATCH' : '❌ NO MATCH');
    
    // Try manually hashing to compare
    console.log('\n📊 Comparison Details:');
    console.log('   Plain password:', plainPassword);
    console.log('   Stored hash length:', user.password.length);
    console.log('   Hash starts with $2', user.password.startsWith('$2') ? '✅ Yes' : '❌ No');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testPassword();
