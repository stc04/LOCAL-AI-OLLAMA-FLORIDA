const axios = require('axios');
const Model = require('../models/Model');

const modelController = {
  // List all available models
  async listModels(req, res) {
    try {
      const response = await axios.get(`${process.env.OLLAMA_API_URL}/api/tags`);
      const ollamaModels = response.data.models || [];
      
      // Get models from our database
      const dbModels = await Model.findAll();
      
      // Merge Ollama API data with our database records
      const mergedModels = ollamaModels.map(ollamaModel => {
        const dbModel = dbModels.find(m => m.name === ollamaModel.name) || {};
        return {
          ...ollamaModel,
          ...dbModel,
          status: dbModel.status || 'available'
        };
      });

      res.json(mergedModels);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch models',
        message: error.message
      });
    }
  },

  // Get model details
  async getModel(req, res) {
    try {
      const { modelName } = req.params;
      
      // Get model from database
      const model = await Model.findByName(modelName);
      
      if (!model) {
        return res.status(404).json({
          error: 'Model not found',
          message: `No model found with name ${modelName}`
        });
      }

      res.json(model);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch model details',
        message: error.message
      });
    }
  },

  // Download a model
  async downloadModel(req, res) {
    try {
      const { modelName } = req.params;
      
      // Update or create model in database
      let model = await Model.findByName(modelName);
      
      if (!model) {
        model = await Model.create({
          name: modelName,
          description: req.body.description || `${modelName} model`,
          version: req.body.version || '1.0.0',
          size: req.body.size || 0,
          status: 'downloading'
        });
      } else {
        model = await Model.update(model.id, { status: 'downloading' });
      }

      // Trigger model download in Ollama
      await axios.post(`${process.env.OLLAMA_API_URL}/api/pull`, {
        name: modelName
      });

      // Update model status to available
      model = await Model.update(model.id, { status: 'available' });

      res.json({
        message: 'Model download initiated successfully',
        model
      });
    } catch (error) {
      // Update model status to error if download fails
      const model = await Model.findByName(req.params.modelName);
      if (model) {
        await Model.update(model.id, { status: 'error' });
      }

      res.status(500).json({
        error: 'Failed to download model',
        message: error.message
      });
    }
  },

  // Delete a model
  async deleteModel(req, res) {
    try {
      const { modelName } = req.params;
      
      // Delete from Ollama
      await axios.delete(`${process.env.OLLAMA_API_URL}/api/delete`, {
        data: { name: modelName }
      });

      // Delete from database
      await Model.deleteByName(modelName);

      res.json({
        message: 'Model deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to delete model',
        message: error.message
      });
    }
  },

  // Update model metadata
  async updateModel(req, res) {
    try {
      const { modelName } = req.params;
      const updateData = req.body;
      
      const existingModel = await Model.findByName(modelName);
      if (!existingModel) {
        return res.status(404).json({
          error: 'Model not found',
          message: `No model found with name ${modelName}`
        });
      }
      const model = await Model.update(existingModel.id, updateData);

      if (!model) {
        return res.status(404).json({
          error: 'Model not found',
          message: `No model found with name ${modelName}`
        });
      }

      res.json({
        message: 'Model updated successfully',
        model
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update model',
        message: error.message
      });
    }
  },

  // Search models
  async searchModels(req, res) {
    try {
      const { query } = req.query;
      
      const models = await Model.search(query);

      res.json(models);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to search models',
        message: error.message
      });
    }
  }
};

module.exports = modelController;
