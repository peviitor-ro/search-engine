import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  jobs: []
}

export const jobsSlice = createSlice({
  name: 'jobs',
  loadMore: true,
  initialState,
  reducers: {
    updateJobs: (state, action) => {
      state.jobs = [...state.jobs, ...action.payload];
    },
    clearJobs: (state) => {
      state.jobs = [];
    },
    updateLoadMore: (state, action) => {
      state.loadMore = action.payload
    },
  }
});

// Action creators are generated for each case reducer function
export const { updateJobs, clearJobs, updateLoadMore } = jobsSlice.actions;

export default jobsSlice.reducer;