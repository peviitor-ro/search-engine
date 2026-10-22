import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_JOBS_PER_PAGE } from "../utils/jobsPerPage";

// Define initial state
const initialState = {
  jobs: [],
  total: 0,
  totalJobs: 0,
  totalCompany: 0,
  loading: true,
  page: 1,
  pageSize: DEFAULT_JOBS_PER_PAGE,
  networkError: false // Track network or connection status
};

// Create slice
const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs(state, action) {
      state.jobs = action.payload;
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
    setPage(state, action) {
      state.page = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
    setNumberOfJobs(state, action) {
      state.totalJobs = action.payload;
    },
    setNumberOfCompany(state, action) {
      state.totalCompany = action.payload;
    },
    setNetworkError(state, action) {
      state.networkError = action.payload;
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
  setPage,
  setPageSize,
  setNumberOfJobs,
  setNumberOfCompany,
  setNetworkError
} = jobsSlice.actions;

// Export reducer
export default jobsSlice.reducer;