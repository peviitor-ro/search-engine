import { createSlice } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
  jobs: [],
  total: 0,
  totalJobs: 0,
  totalCompany: 0,
  loading: true,
  page: 1,
  pageSize: 10,
 feature/issue-two-combined
  networkError: false

  networkError: false // Track network or connection status
 main
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
      // The API doesn't publish its page size, so infer it from the
      // largest results page actually seen (a full page is always >= a
      // trailing partial page, so this converges to the true value).
      if (action.payload > state.pageSize) {
        state.pageSize = action.payload;
      }
    },
    setNetworkError(state, action) {
      state.networkError = action.payload;
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
  setNetworkError,
  setNumberOfJobs,
  setNumberOfCompany,
  setNetworkError
} = jobsSlice.actions;

// Export reducer
export default jobsSlice.reducer;