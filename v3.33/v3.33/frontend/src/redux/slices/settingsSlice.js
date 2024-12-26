import { createSlice } from '@reduxjs/toolkit';

// Initialize with default URL if not in localStorage
const defaultApiUrl = 'http://127.0.0.1:11434';
if (!localStorage.getItem('ollamaApiUrl')) {
  localStorage.setItem('ollamaApiUrl', defaultApiUrl);
}

const initialState = {
  ollamaApiUrl: localStorage.getItem('ollamaApiUrl'),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setOllamaApiUrl: (state, action) => {
      const url = action.payload || defaultApiUrl;
      state.ollamaApiUrl = url;
      localStorage.setItem('ollamaApiUrl', url);
    },
  },
});

export const { setOllamaApiUrl } = settingsSlice.actions;
export const selectOllamaApiUrl = (state) => state.settings.ollamaApiUrl;

export default settingsSlice.reducer;
