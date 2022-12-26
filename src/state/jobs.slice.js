import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  total: 0,
  totalRomania: 0,
  isLoadMore: true,
  loading: false
}

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    addMoreJobs: (state, action) => {
      state.jobs = [...state.jobs, ...action.payload];
    },
    updateNewSearch: (state, action) => {
      state.jobs = [...action.payload];
    },
    clearJobs: (state) => {
      state.jobs = [];
    },
    updateTotal: (state, action) => {
      state.total = action.payload;
    },
    updateTotalRomania: (state, action) => {
      state.totalRomania = action.payload;
    },
    clearTotal: (state) => {
      state.total = 0;
    },
    updateIsLoadMore: (state, action) => {
      state.isLoadMore = action.payload
    },
  }
});

// Action creators are generated for each case reducer function
export const { addMoreJobs, clearJobs, updateNewSearch, updateTotal, clearTotal, updateTotalRomania, updateIsLoadMore } = jobsSlice.actions;

export default jobsSlice.reducer;