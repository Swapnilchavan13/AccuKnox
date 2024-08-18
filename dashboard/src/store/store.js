import { configureStore } from '@reduxjs/toolkit';
import widgetReducer from '../store/widgetSlice';

// Function to save state to localStorage
const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('dashboardState', serializedState);
  } catch (e) {
    console.error('Could not save state', e);
  }
};

// Function to load state from localStorage
const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('dashboardState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Could not load state', e);
    return undefined;
  }
};

// Load persisted state
const persistedState = loadStateFromLocalStorage();

const store = configureStore({
  reducer: {
    widgets: widgetReducer
  },
  preloadedState: persistedState
});

// Subscribe to store updates to save to localStorage
store.subscribe(() => {
  saveStateToLocalStorage(store.getState());
});

export default store;
