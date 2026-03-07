#!/usr/bin/env node

import sequelize from '../src/config/sequelize.js';
import User from '../src/models/User.js';

const checkEmail = async () => {
  try {
    console.log('📧 Checking exact email in database...\n');
    
    await sequelize.authenticate();
    
    // Get all users
    const users = await User.findAll();
    
    console.log('All users in database:');
    users.forEach(user => {
      console.log('   Email (raw):', JSON.stringify(user.email));
      console.log('   Email (lower):', user.email.toLowerCase());
      console.log('---');
    });
    
    // Test queries
    console.log('\nTesting different queries:');
    
    const query1 = await User.findOne({ where: { email: 'admin@cathyDecor.com' } });
    console.log('   Query: "admin@cathyDecor.com" ->', query1 ? '✅ Found' : '❌ Not found');
    
    const query2 = await User.findOne({ where: { email: 'admin@cathydecor.com' } });
    console.log('   Query: "admin@cathydecor.com" ->', query2 ? '✅ Found' : '❌ Not found');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkEmail();
