import { createSlice } from '@reduxjs/toolkit';

export const queriesSlice = createSlice({
  name: 'queries',
  initialState: {
    city: '',
    company: '',
    country: '',
    page: 1,
    q: ''
  },
  reducers: {
    updateCity: (state, action) => {
      state.city = action.payload;
    },
    updateCompany: (state, action) => {
      state.company = action.payload;
    },
    updateCpuntry: (state, action) => {
      state.country = action.payload;
    },
    updatePage: (state, action) => {
      state.page = action.payload;
    },
    updateQ: (state, action) => {
      state.q = action.payload;
    }
  }
});

export const { updateCity, updateCompany, updateCpuntry, updateQ, updatePage } = queriesSlice.actions;
export default queriesSlice.reducer;
