const axios = require('axios');

// Default Ollama API URL if not set in environment
const DEFAULT_OLLAMA_API_URL = 'http://127.0.0.1:11434';

const ollamaController = {
  // List available models
  async listModels(req, res) {
    try {
      const apiUrl = process.env.OLLAMA_API_URL || DEFAULT_OLLAMA_API_URL;
      const response = await axios.get(`${apiUrl}/api/tags`);
      console.log('Models list response:', response.data);
      res.json(response.data.models || []);
    } catch (error) {
      console.error('List models error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to list models',
        message: error.response?.data?.message || error.message
      });
    }
  },

  // Pull/download a model
  async pullModel(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({
          error: 'Missing required field',
          message: 'Model name is required'
        });
      }

      console.log('Pulling model:', name);
      const apiUrl = process.env.OLLAMA_API_URL || DEFAULT_OLLAMA_API_URL;
      const response = await axios.post(`${apiUrl}/api/pull`, {
        name,
        stream: false
      });

      console.log('Pull response:', response.data);
      res.json({
        message: 'Model pulled successfully',
        data: response.data
      });
    } catch (error) {
      console.error('Pull error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to pull model',
        message: error.response?.data?.message || error.message
      });
    }
  },

  // Get API status
  async getStatus(req, res) {
    try {
      const apiUrl = process.env.OLLAMA_API_URL || DEFAULT_OLLAMA_API_URL;
      const response = await axios.get(`${apiUrl}/api/status`);
      res.json(response.data);
    } catch (error) {
      console.error('Status error:', error);
      res.status(500).json({
        error: 'Failed to get API status',
        message: error.message
      });
    }
  },

  // List available endpoints
  async listEndpoints(req, res) {
    const endpoints = [
      {
        path: '/api/status',
        method: 'GET',
        description: 'Get Ollama API status',
        authenticated: true
      },
      {
        path: '/api/tags',
        method: 'GET',
        description: 'List all available models',
        authenticated: true
      },
      {
        path: '/api/pull',
        method: 'POST',
        description: 'Download a model',
        authenticated: true,
        parameters: {
          name: 'string (required) - Name of the model to download'
        }
      },
      {
        path: '/api/generate',
        method: 'POST',
        description: 'Generate text using a model',
        authenticated: true,
        parameters: {
          model: 'string (required) - Name of the model to use',
          prompt: 'string (required) - Input prompt for generation'
        }
      },
      {
        path: '/api/chat',
        method: 'POST',
        description: 'Chat with a model',
        authenticated: true,
        parameters: {
          model: 'string (required) - Name of the model to use',
          messages: 'array (required) - Array of message objects'
        }
      }
    ];

    res.json(endpoints);
  },

  // Chat with a model
  async chat(req, res) {
    try {
      const { model, messages } = req.body;
      console.log('Chat request:', { model, messages });

      if (!model || !messages) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'Both model and messages are required'
        });
      }

      // Add default model if not specified
      const modelToUse = model || 'tinyllama:latest';
      const apiUrl = process.env.OLLAMA_API_URL || DEFAULT_OLLAMA_API_URL;

      console.log('Making request to Ollama API:', {
        url: `${apiUrl}/api/chat`,
        model: modelToUse,
        messages
      });

      const response = await axios.post(`${apiUrl}/api/chat`, {
        model: modelToUse,
        messages,
        stream: false
      });

      // Format the response to match the expected structure
      const formattedResponse = {
        role: 'assistant',
        content: response.data.message.content
      };

      console.log('Formatted response:', formattedResponse);
      res.json(formattedResponse);
    } catch (error) {
      console.error('Chat error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Chat request failed',
        message: error.response?.data?.message || error.message
      });
    }
  },

  // Generate text using a model
  async generateText(req, res) {
    try {
      const { model, prompt, options = {} } = req.body;
      console.log('Generate request:', { model, prompt, options });

      const apiUrl = process.env.OLLAMA_API_URL || DEFAULT_OLLAMA_API_URL;
      const response = await axios.post(`${apiUrl}/api/generate`, {
        model,
        prompt,
        ...options,
        stream: false
      });

      console.log('Generate response:', response.data);

      res.json({
        message: response.data.response,
        model: model,
        created: new Date().toISOString()
      });
    } catch (error) {
      console.error('Generate error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Text generation failed',
        message: error.response?.data?.message || error.message
      });
    }
  },

  // Get model information
  async getModelInfo(req, res) {
    try {
      const { modelName } = req.params;
      console.log('Getting model info for:', modelName);
      
      const apiUrl = process.env.OLLAMA_API_URL || DEFAULT_OLLAMA_API_URL;
      const response = await axios.post(`${apiUrl}/api/show`, {
        name: modelName
      });

      console.log('Model info response:', response.data);
      res.json(response.data);
    } catch (error) {
      console.error('Model info error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to get model information',
        message: error.response?.data?.message || error.message
      });
    }
  },

  // Create a model copy
  async createModelCopy(req, res) {
    try {
      const { source, destination } = req.body;
      console.log('Creating model copy:', { source, destination });
      
      const apiUrl = process.env.OLLAMA_API_URL || DEFAULT_OLLAMA_API_URL;
      const response = await axios.post(`${apiUrl}/api/copy`, {
        source,
        destination
      });

      console.log('Copy response:', response.data);
      res.json({
        message: 'Model copied successfully',
        data: response.data
      });
    } catch (error) {
      console.error('Copy error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to copy model',
        message: error.response?.data?.message || error.message
      });
    }
  }
};

module.exports = ollamaController;
