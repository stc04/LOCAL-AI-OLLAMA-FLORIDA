const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Simple login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    // Find user
    const user = await User.findByEmail(email);
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await User.comparePassword(user, password);
    console.log('Password valid:', isValidPassword ? 'yes' : 'no');

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
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
  console.log('Try logging in with:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
  console.log('\nUse this command to test:');
  console.log('curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\\"email\\": \\"admin@example.com\\", \\"password\\": \\"admin123\\"}"');
});
