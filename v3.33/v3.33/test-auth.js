const express = require('express');
const cors = require('cors');
const axios = require('axios');
const authRoutes = require('./routes/auth');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Start server
const PORT = 5000;
const server = app.listen(PORT, async () => {
  console.log(`Test server running on port ${PORT}`);

  try {
    // Test login
    console.log('\nTesting login with admin credentials...');
    const loginResponse = await axios.post(`http://localhost:${PORT}/api/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });

    console.log('\nLogin successful!');
    console.log('Token:', loginResponse.data.token);
    console.log('User:', loginResponse.data.user);

    // Test protected route
    console.log('\nTesting protected route...');
    const profileResponse = await axios.get(`http://localhost:${PORT}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${loginResponse.data.token}`
      }
    });

    console.log('\nProfile fetch successful!');
    console.log('Profile:', profileResponse.data);

  } catch (error) {
    console.error('\nError:', error.response ? error.response.data : error.message);
  } finally {
    // Close server
    server.close(() => {
      console.log('\nTest server closed');
      process.exit(0);
    });
  }
});
