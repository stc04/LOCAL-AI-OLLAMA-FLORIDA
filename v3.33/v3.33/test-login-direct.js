const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Simple login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    // Read users from file
    const usersFile = path.join(__dirname, 'data', 'users.json');
    const usersData = await fs.readFile(usersFile, 'utf8');
    const users = JSON.parse(usersData);

    console.log('Looking for user with email:', email);
    const user = users.find(u => u.email === email);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    console.log('User found, comparing passwords');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('\nTry logging in with:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
  console.log('\nUse this command to test:');
  console.log('curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\\"email\\": \\"admin@example.com\\", \\"password\\": \\"admin123\\"}"');
});
