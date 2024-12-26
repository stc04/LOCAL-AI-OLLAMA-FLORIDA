const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const corsConfig = require('./middleware/corsConfig');

// Load environment variables
dotenv.config();

const app = express();

// Apply CORS configuration
app.use(cors(corsConfig));

// Handle preflight requests
app.options('*', cors(corsConfig));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware for auth headers
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  console.log('Authorization Header:', req.headers.authorization);
  next();
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/models', require('./routes/models'));
app.use('/api/ollama', require('./routes/ollama'));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    auth: 'working'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log('\nDefault admin credentials:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
});
