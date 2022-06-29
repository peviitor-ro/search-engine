import { createSlice } from '@reduxjs/toolkit';

export const resultsSlice = createSlice({
  name: 'results',
  initialState: {
    total: 0,
    jobs: [], // array of objects, step 10
  },
  reducers: {
    updateTotal: (state, action) => {
      state.total = action.payload;
    },
    updateJobs: (state, action) => {
      state.jobs = [...state.jobs, ...action.payload];
    },
  }
});

export const { updateTotal, updateJobs } = resultsSlice.actions;
export default resultsSlice.reducer;
