import { createSlice } from '@reduxjs/toolkit';
import { queriesConst } from '../constants/queries';

const initialState = {
  [queriesConst.q]: '',
  [queriesConst.city]: '',
  [queriesConst.company]: '',
  [queriesConst.country]: '',
  [queriesConst.page]: 1
}

export const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    updateQ: (state, action) => {
      state[queriesConst.q] = action.payload ? action.payload : '';
    },
    updatCity: (state, action) => {
      state[queriesConst.city] = action.payload ? action.payload : '';
    },
    updateCompany: (state, action) => {
      state[queriesConst.company] = action.payload ? action.payload : '';
    },
    updateCountry: (state, action) => {
      state[queriesConst.country] = action.payload ? action.payload : '';
    },
    incrementPage: (state) => {
      state[queriesConst.page] = state[queriesConst.page] + 1;
    },
    setPageToOne: (state) => {
      state[queriesConst.page] = 1;
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateQ, updatCity, updateCompany, updateCountry, incrementPage, setPageToOne } = querySlice.actions;

export default querySlice.reducer;