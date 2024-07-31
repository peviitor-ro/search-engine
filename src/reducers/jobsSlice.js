import { createSlice } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
  jobs: [],
  total: 0,
  totalJobs: 0,
  totalCompany: 0,
  loading: false
};

// Create slice
const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs(state, action) {
      // Filter out duplicates before adding new jobs
      const uniqueJobs = action.payload.filter(
        (job) => !state.jobs.some((existingJob) => existingJob.id === job.id)
      );
      state.jobs = [...state.jobs, ...uniqueJobs];
    },
    clearJobs(state) {
      state.jobs = [];
    },
    setTotal(state, action) {
      state.total = action.payload;
    },
    clearTotal: (state) => {
      state.total = 0;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setNumberOfJobs(state, action) {
      state.totalJobs = action.payload;
    },
    setNumberOfCompany(state, action) {
      state.totalCompany = action.payload;
    }
  }
});

// Export actions
export const {
  setJobs,
  setTotal,
  clearJobs,
  clearTotal,
  setLoading,
  setNumberOfJobs,
  setNumberOfCompany
} = jobsSlice.actions;

// Export reducer
export default jobsSlice.reducer;
