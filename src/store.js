import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

// Slices

import jobsSlice from "./reducers/jobsSlice";

export default configureStore({
  reducer: {
    jobs: jobsSlice,
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), thunk],
});
