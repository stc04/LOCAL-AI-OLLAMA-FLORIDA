import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import modelsReducer from './slices/modelsSlice';
import uiReducer from './slices/uiSlice';
import settingsReducer from './slices/settingsSlice';
import { injectStore } from '../api/api';

const store = configureStore({
  reducer: {
    auth: authReducer,
    models: modelsReducer,
    ui: uiReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loginSuccess', 'auth/logout'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Inject store into API configuration
injectStore(store);

export default store;
