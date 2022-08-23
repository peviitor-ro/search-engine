import { createSlice } from '@reduxjs/toolkit';

export const resultsSlice = createSlice({
  name: 'results',
  initialState: {
    querySearched: '',
    total: 0,
    jobs: [], // array of objects, step 10
    isLoading: true,
    isMoreJobs: true
  },
  reducers: {
    updateTotal: (state, action) => {
      state.total = action.payload;
    },
    getNewJobs: (state, action) => {
      state.jobs = [...action.payload];
    },
    addMoreJobs: (state, action) => {
      state.jobs = [...state.jobs, ...action.payload];
    },
    updateQuerySearched: (state, action) => {
      state.querySearched = action.payload;
    },
    updateLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateIsMoreJobs: (state, action) => {
      state.isMoreJobs = action.payload;
    }
  }
});

export const { updateTotal, getNewJobs, addMoreJobs, updateQuerySearched, updateLoading, updateIsMoreJobs } = resultsSlice.actions;
export default resultsSlice.reducer;
