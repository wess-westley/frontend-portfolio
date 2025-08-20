import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light', // only keeping theme since login isn't needed
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { toggleTheme } = uiSlice.actions;

export default uiSlice.reducer;
