import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    location: null,
    selectedLocation: '',
    loaded: false,
    error : false
    }

export const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        updateLocation: (state, action) => {
            state.location = action.payload;
        },
        updateSelectedLocation: (state, action) => {
            state.selectedLocation = action.payload;
        },
        updateLoaded: (state, action) => {
            state.loaded = action.payload;
        },
        updateError: (state, action) => {
            state.error = action.payload;
        }
    }
});