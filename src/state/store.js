import { configureStore } from '@reduxjs/toolkit';
import queriesSlice from './slices/queries.slice';
import resultsSlice from './slices/results.slice';

export default configureStore({
  reducer: {
    queries: queriesSlice,
    results: resultsSlice
  }
});
