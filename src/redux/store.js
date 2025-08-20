import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import projectReducer from './slices/projectSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,      // handles theme toggling
    projects: projectReducer, // handles projects
  },
});
