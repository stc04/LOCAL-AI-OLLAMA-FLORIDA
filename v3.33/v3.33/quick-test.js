const axios = require('axios');

async function quickTest() {
  try {
    console.log('Testing login with admin credentials...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });

    if (response.data.token) {
      console.log('\nLogin successful! ✅');
      console.log('Token:', response.data.token.substring(0, 50) + '...');
      console.log('User:', {
        username: response.data.user.username,
        email: response.data.user.email,
        role: response.data.user.role
      });
    }
  } catch (error) {
    console.error('\nLogin failed! ❌');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

quickTest();
