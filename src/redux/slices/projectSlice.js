// src/redux/slices/projectSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/projects/');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const syncGithubProjects = createAsyncThunk(
  'projects/syncGithubProjects',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post('/projects/sync-github/', {
        username: 'wess-westley',
      });

      return response.data.projects;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        'GitHub sync failed';
      return rejectWithValue(message);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    synced: [],
    syncStatus: 'idle',
    syncError: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // 👇 Track GitHub Sync
      .addCase(syncGithubProjects.pending, (state) => {
        state.syncStatus = 'loading';
        state.syncError = null;
      })
      .addCase(syncGithubProjects.fulfilled, (state, action) => {
        state.synced = action.payload;
        state.syncStatus = 'succeeded';
      })
      .addCase(syncGithubProjects.rejected, (state, action) => {
        state.syncStatus = 'failed';
        state.syncError = action.payload;
      });
  },
});

export default projectSlice.reducer;
