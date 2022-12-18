import { createSlice } from '@reduxjs/toolkit';

// const demoState = [
//   { jobTitle: 'Tester1', company: 'EPAM1', location: 'Remote | Full-time', link: 'https://www.google.com' },
//   { jobTitle: 'Tester2', company: 'EPAM2', location: 'Remote | Full-time', link: 'https://www.google.com' },
//   { jobTitle: 'Tester3', company: 'EPAM3', location: 'Remote | Full-time', link: 'https://www.google.com' },
//   { jobTitle: 'Tester4', company: 'EPAM4', location: 'Remote | Full-time', link: 'https://www.google.com' },
//   { jobTitle: 'Tester5', company: 'EPAM5', location: 'Remote | Full-time', link: 'https://www.google.com' },
// ]

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
    updateLoading: (state, action) => {
      state.loadMore = action.payload
    },
  }
});

// Action creators are generated for each case reducer function
export const { addMoreJobs, clearJobs, updateNewSearch, updateTotal, clearTotal, updateTotalRomania, updateIsLoadMore, updateLoading } = jobsSlice.actions;

export default jobsSlice.reducer;