const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

async function setupAndTest() {
  try {
    // Create admin user with known password
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminUser = {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      preferences: {
        theme: 'light',
        defaultModel: 'llama2'
      },
      id: '1234567890',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to users.json
    await fs.writeFile(
      path.join(__dirname, 'data', 'users.json'),
      JSON.stringify([adminUser], null, 2)
    );

    console.log('Admin user created with:');
    console.log('Email:', adminUser.email);
    console.log('Password:', password);
    console.log('Hashed Password:', hashedPassword);

    // Wait for server to be ready
    console.log('\nWaiting for server to be ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test login
    console.log('\nTesting login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });

    console.log('\nLogin successful!');
    console.log('Token:', loginResponse.data.token);
    console.log('User:', loginResponse.data.user);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

// Run setup and test
setupAndTest();
