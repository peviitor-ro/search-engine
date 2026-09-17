import { configureStore } from "@reduxjs/toolkit";

// Slices

import jobsSlice from "./reducers/jobsSlice";

export default configureStore({
  reducer: {
    jobs: jobsSlice
  }
  // middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), thunk],
});
