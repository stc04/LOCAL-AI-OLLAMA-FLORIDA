const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header format');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    console.log('Extracted token:', token);
    
    if (!token) {
      throw new Error('No authentication token provided');
    }

    // Verify token
    console.log('JWT Secret:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp <= currentTime) {
      throw new Error('Token has expired');
    }
    
    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
};

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new Error('Access denied: Admin privileges required');
    }
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(403).json({ 
      error: 'Authorization failed',
      message: error.message 
    });
  }
};

module.exports = {
  auth,
  adminAuth
};
