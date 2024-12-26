const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authController = {
  // Register new user
  async register(req, res) {
    try {
      const { email, username, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: 'Registration failed',
          message: 'Email already registered'
        });
      }

      // Create new user
      const user = await User.create({
        email,
        username,
        password
      });

      // Generate token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Registration successful',
        token,
        user
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Registration failed',
        message: error.message
      });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { email, username, currentPassword, newPassword } = req.body;
      
      // Find user
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User profile could not be found'
        });
      }

      // Verify current password if provided
      if (currentPassword) {
        const isMatch = await User.comparePassword(user, currentPassword);
        if (!isMatch) {
          return res.status(401).json({
            error: 'Authentication failed',
            message: 'Current password is incorrect'
          });
        }
      }

      // Update user data
      const updates = {};
      if (email) updates.email = email;
      if (username) updates.username = username;
      if (newPassword) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(newPassword, salt);
      }

      // Update user in database
      const updatedUser = await User.db.update(user.id, updates);

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;

      res.json({
        message: 'Profile updated successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        error: 'Failed to update profile',
        message: error.message
      });
    }
  },

  // Simple login with hardcoded credentials
  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log('Login attempt:', { email, password });

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isMatch = await User.comparePassword(user, password);
      if (!isMatch) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid email or password'
        });
      }

      console.log('Credentials match, generating token...');
      
      // Generate token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Update last login
      await User.updateLastLogin(user.id);

      // Remove password from user object
      const { password: userPassword, ...userWithoutPassword } = user;
      
      // Return success response
      return res.json({
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
  },

  // Get user profile
  async getProfile(req, res) {
    try {
      console.log('Getting profile for user:', req.user);
      
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User profile could not be found'
        });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Failed to get profile',
        message: error.message
      });
    }
  }
};

module.exports = authController;
