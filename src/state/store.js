import { configureStore } from '@reduxjs/toolkit';
import querySlice from './query.slice';

export const store = configureStore({
  reducer: {
    query: querySlice
  },
});
