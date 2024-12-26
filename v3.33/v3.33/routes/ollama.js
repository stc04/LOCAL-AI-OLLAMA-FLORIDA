const express = require('express');
const router = express.Router();
const ollamaController = require('../controllers/ollamaController');
const { auth, adminAuth } = require('../middleware/auth');

// API Documentation and Status
router.get('/status', auth, ollamaController.getStatus);
router.get('/endpoints', auth, ollamaController.listEndpoints);

// Model Operations
router.get('/models', auth, ollamaController.listModels);
router.post('/models/pull', auth, ollamaController.pullModel);
router.get('/models/:modelName', auth, ollamaController.getModelInfo);
router.post('/generate', auth, ollamaController.generateText);
router.post('/chat', auth, ollamaController.chat);

// Admin Operations
router.post('/models/copy', auth, adminAuth, ollamaController.createModelCopy);

module.exports = router;
