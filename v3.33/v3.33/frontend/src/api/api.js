import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Store reference for accessing Redux state
let store = null;
export const injectStore = _store => {
  store = _store;
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token and Ollama API URL to requests if they exist
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const ollamaApiUrl = store?.getState().settings.ollamaApiUrl;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (ollamaApiUrl) {
      config.headers['x-ollama-api-url'] = ollamaApiUrl;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updatePreferences: (preferences) => api.put('/auth/preferences', { preferences }),
  updateProfile: (profileData) => api.put('/auth/profile', profileData)
};

// Models API
export const modelsAPI = {
  getAll: () => api.get('/models'),
  getOne: (modelName) => api.get(`/models/${modelName}`),
  download: (modelName) => api.post(`/models/${modelName}/download`),
  delete: (modelName) => api.delete(`/models/${modelName}`),
  search: (query) => api.get('/models/search', { params: { query } }),
  update: (modelName, data) => api.put(`/models/${modelName}`, data)
};

// Ollama API
export const ollamaAPI = {
  getStatus: () => api.get('/ollama/status'),
  getEndpoints: () => api.get('/ollama/endpoints'),
  listModels: () => api.get('/ollama/models'),
  pullModel: (name) => api.post('/ollama/models/pull', { name }),
  generateText: (model, prompt, options) => 
    api.post('/ollama/generate', { model, prompt, options }),
  chat: (model, messages) => 
    api.post('/ollama/chat', { model, messages }),
  getModelInfo: (modelName) => api.get(`/ollama/models/${modelName}`),
  createModelCopy: (source, destination) => 
    api.post('/ollama/models/copy', { source, destination })
};

// Error handler helper
export const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'An error occurred';
  const status = error.response?.status;
  const data = error.response?.data;

  return {
    message,
    status,
    data
  };
};

// Success response helper
export const handleApiSuccess = (response) => {
  return {
    data: response.data,
    status: response.status,
    message: response.data?.message
  };
};

export default api;
