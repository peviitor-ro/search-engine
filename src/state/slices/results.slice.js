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
      console.log(4)
      state.jobs = [...action.payload];
    },
    addMoreJobs: (state, action) => {
      console.log(3)
      state.jobs = [...state.jobs, ...action.payload];
    },
    updateQuerySearched: (state, action) => {
      state.querySearched = action.payload;
    },
  }
});

export const { updateTotal, getNewJobs, addMoreJobs, updateQuerySearched } = resultsSlice.actions;
export default resultsSlice.reducer;
