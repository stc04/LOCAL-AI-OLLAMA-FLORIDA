const axios = require('axios');

async function testLogin() {
  try {
    console.log('Attempting login...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });

    console.log('\nLogin successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('\nLogin failed!');
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testLogin();
