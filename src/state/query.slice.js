import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    q: '',
    cities: '',
    companies: '',
    countries: '',
  }
  
  export const querySlice = createSlice({
    name: 'query',
    initialState,
    reducers: {
      updateQ: (state, action) => {
        state.q += action.payload
      },
    
    }
  });
  
  // Action creators are generated for each case reducer function
  export const { updateQ } = querySlice.actions
  
  export default querySlice.reducer