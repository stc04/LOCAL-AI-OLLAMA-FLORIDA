const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with admin credentials...');
    
    // First, let's see what's in our users.json file
    const fs = require('fs');
    const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
    console.log('\nCurrent users in database:', users);

    // Attempt login
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });

    console.log('\nLogin Response:', {
      status: response.status,
      data: response.data
    });

    if (response.data.token) {
      console.log('\nLogin successful!');
      console.log('Token:', response.data.token);
      console.log('User:', response.data.user);

      // Test protected route
      const protectedResponse = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${response.data.token}`
        }
      });

      console.log('\nProtected Route Response:', protectedResponse.data);
    }
  } catch (error) {
    console.error('\nError:', error.response ? {
      status: error.response.status,
      data: error.response.data
    } : error.message);
  }
}

// Run the test
console.log('Starting login test...\n');
testLogin();
