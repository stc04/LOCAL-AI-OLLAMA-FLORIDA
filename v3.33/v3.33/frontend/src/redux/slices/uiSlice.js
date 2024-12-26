import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: true,
  notifications: [],
  loading: {
    global: false,
    models: false,
    api: false
  },
  modal: {
    isOpen: false,
    type: null,
    data: null
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      // Update document class for Tailwind dark mode
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        duration: 5000, // Default duration
        ...action.payload
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      const { type, value } = action.payload;
      state.loading[type] = value;
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null
      };
    }
  }
});

// Actions
export const {
  toggleTheme,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  setLoading,
  openModal,
  closeModal
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectNotifications = (state) => state.ui.notifications;
export const selectLoading = (type) => (state) => state.ui.loading[type];
export const selectModal = (state) => state.ui.modal;

// Thunk for showing a notification with auto-removal
export const showNotification = (notification) => (dispatch) => {
  const id = Date.now();
  const duration = notification.duration || 5000;
  
  dispatch(addNotification({ ...notification, id }));
  
  setTimeout(() => {
    dispatch(removeNotification(id));
  }, duration);
};

export default uiSlice.reducer;
