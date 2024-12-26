import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { modelsAPI, ollamaAPI, handleApiError } from '../../api/api';

// Async thunks for Ollama models
export const fetchOllamaModels = createAsyncThunk(
  'models/fetchOllamaModels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ollamaAPI.listModels();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const pullOllamaModel = createAsyncThunk(
  'models/pullOllamaModel',
  async (modelName, { rejectWithValue }) => {
    try {
      const response = await ollamaAPI.pullModel(modelName);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async thunks
export const fetchModels = createAsyncThunk(
  'models/fetchModels',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await modelsAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const downloadModel = createAsyncThunk(
  'models/downloadModel',
  async (modelName, { getState, rejectWithValue }) => {
    try {
      const response = await modelsAPI.download(modelName);
      return response.data.model;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteModel = createAsyncThunk(
  'models/deleteModel',
  async (modelName, { getState, rejectWithValue }) => {
    try {
      await modelsAPI.delete(modelName);
      return modelName;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const searchModels = createAsyncThunk(
  'models/searchModels',
  async (query, { getState, rejectWithValue }) => {
    try {
      const response = await modelsAPI.search(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Initial state
const initialState = {
  models: [],
  filteredModels: [],
  selectedModel: null,
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    status: 'all',
    size: 'all',
    architecture: 'all'
  }
};

// Slice
const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    filterModels: (state) => {
      state.filteredModels = state.models.filter(model => {
        const matchesSearch = model.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                            model.description.toLowerCase().includes(state.searchQuery.toLowerCase());
        
        const matchesStatus = state.filters.status === 'all' || model.status === state.filters.status;
        const matchesSize = state.filters.size === 'all' || 
                          (state.filters.size === 'small' && model.size < 5000000000) ||
                          (state.filters.size === 'medium' && model.size >= 5000000000 && model.size < 10000000000) ||
                          (state.filters.size === 'large' && model.size >= 10000000000);
        const matchesArchitecture = state.filters.architecture === 'all' || 
                                  model.metadata?.architecture === state.filters.architecture;

        return matchesSearch && matchesStatus && matchesSize && matchesArchitecture;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch models cases
      .addCase(fetchModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.loading = false;
        state.models = action.payload;
        state.filteredModels = action.payload;
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch models';
      })
      // Download model cases
      .addCase(downloadModel.pending, (state, action) => {
        const model = state.models.find(m => m.name === action.meta.arg);
        if (model) {
          model.status = 'downloading';
        }
      })
      .addCase(downloadModel.fulfilled, (state, action) => {
        const index = state.models.findIndex(m => m.name === action.payload.name);
        if (index !== -1) {
          state.models[index] = action.payload;
        }
      })
      .addCase(downloadModel.rejected, (state, action) => {
        const model = state.models.find(m => m.name === action.meta.arg);
        if (model) {
          model.status = 'error';
        }
        state.error = action.payload?.message || 'Failed to download model';
      })
      // Delete model cases
      .addCase(deleteModel.fulfilled, (state, action) => {
        state.models = state.models.filter(model => model.name !== action.payload);
        state.filteredModels = state.filteredModels.filter(model => model.name !== action.payload);
        if (state.selectedModel?.name === action.payload) {
          state.selectedModel = null;
        }
      })
      // Search models cases
      .addCase(searchModels.fulfilled, (state, action) => {
        state.filteredModels = action.payload;
      })
      // Ollama model cases
      .addCase(fetchOllamaModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOllamaModels.fulfilled, (state, action) => {
        state.loading = false;
        state.models = action.payload;
        state.filteredModels = action.payload;
      })
      .addCase(fetchOllamaModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch Ollama models';
      })
      .addCase(pullOllamaModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pullOllamaModel.fulfilled, (state, action) => {
        state.loading = false;
        // Check if model already exists
        const exists = state.models.some(m => m.name === action.payload.name);
        if (!exists) {
          state.models = [...state.models, action.payload];
          state.filteredModels = state.models;
        }
      })
      .addCase(pullOllamaModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to pull Ollama model';
      });
  }
});

// Actions
export const {
  setSelectedModel,
  clearError,
  setSearchQuery,
  setFilters,
  filterModels
} = modelsSlice.actions;

// Selectors
export const selectAllModels = (state) => state.models.models;
export const selectFilteredModels = (state) => state.models.filteredModels;
export const selectSelectedModel = (state) => state.models.selectedModel;
export const selectModelsLoading = (state) => state.models.loading;
export const selectModelsError = (state) => state.models.error;
export const selectSearchQuery = (state) => state.models.searchQuery;
export const selectFilters = (state) => state.models.filters;

export default modelsSlice.reducer;
