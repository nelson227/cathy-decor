#!/usr/bin/env node

import axios from 'axios';

const testLogin = async () => {
  try {
    console.log('🧪 Testing login endpoint...\n');

    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@cathyDecor.com',
      password: 'Admin123'
    });

    console.log('✅ Response received:');
    console.log(JSON.stringify(response.data, null, 2));

    // Verify structure
    console.log('\n📋 Structure Check:');
    console.log('   - success:', response.data.success);
    console.log('   - data:', response.data.data);
    console.log('   - data.role:', response.data.data?.role);
    console.log('   - token:', response.data.token ? 'présent' : 'absent');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testLogin();
