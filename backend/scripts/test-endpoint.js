#!/usr/bin/env node

import axios from 'axios';

axios.get('http://localhost:5000/api/auth/test')
  .then(response => {
    console.log('✅ /api/auth/test response:');
    console.log(JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });
