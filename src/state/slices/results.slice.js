import { createSlice } from '@reduxjs/toolkit';

export const resultsSlice = createSlice({
  name: 'results',
  initialState: {
    querySearched: '',
    total: 0,
    jobs: [], // array of objects, step 10
  },
  reducers: {
    updateTotal: (state, action) => {
      state.total = action.payload;
    },
    getNewJobs: (state, action) => {
      state.jobs = [...action.payload];
    },
    updateJobs: (state, action) => {
      state.jobs = [...action.payload];
    },
    updateQuerySearched: (state, action) => {
      state.querySearched = action.payload;
    },
  }
});

export const { updateTotal, getNewJobs, updateJobs, updateQuerySearched } = resultsSlice.actions;
export default resultsSlice.reducer;
