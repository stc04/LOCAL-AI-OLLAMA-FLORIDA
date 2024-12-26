const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');
const { auth, adminAuth } = require('../middleware/auth');

// Protected routes - require authentication
router.get('/', auth, modelController.listModels);
router.get('/search', auth, modelController.searchModels);
router.get('/:modelName', auth, modelController.getModel);
router.post('/:modelName/download', auth, modelController.downloadModel);

// Admin-only routes
router.put('/:modelName', auth, adminAuth, modelController.updateModel);
router.delete('/:modelName', auth, adminAuth, modelController.deleteModel);

module.exports = router;
