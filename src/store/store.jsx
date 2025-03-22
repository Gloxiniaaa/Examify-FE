// store.js
import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from './authSlice';


const store = configureStore({
  reducer: {
    authentication: authenticationReducer
  },
});

export default store;
