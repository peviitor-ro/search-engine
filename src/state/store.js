import { configureStore } from '@reduxjs/toolkit';
import jobsSlice from './jobs.slice';
import querySlice from './query.slice';
import { locationSlice } from './location.slice';

export const store = configureStore({
  reducer: {
    query: querySlice,
    jobs: jobsSlice,
    location: locationSlice.reducer,
  },
});
