import { configureStore } from '@reduxjs/toolkit';
import jobsSlice from './jobs.slice';
import querySlice from './query.slice';

export const store = configureStore({
  reducer: {
    query: querySlice,
    jobs: jobsSlice
  },
});
