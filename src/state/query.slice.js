import { createSlice } from '@reduxjs/toolkit';
import { queries } from '../constants/queries';

const initialState = {
  [queries.q]: '',
  [queries.cities]: '',
  [queries.companies]: '',
  [queries.countries]: '',
}

export const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    updateQ: (state, action) => {
      state.q = action.payload;
    },
    updatCities: (state, action) => {
      state.cities = action.payload;
    },
    updateCompanies: (state, action) => {
      state.companies = action.payload;
    },
    updateCountries: (state, action) => {
      state.countries = action.payload;
    },
  }
});

// Action creators are generated for each case reducer function
export const { updateQ, updatCities, updateCompanies, updateCountries } = querySlice.actions;

export default querySlice.reducer;