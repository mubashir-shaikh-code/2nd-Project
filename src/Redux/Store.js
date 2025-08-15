// src/Redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './Slices/CartSlice';
import authReducer from './Slices/AuthSlice';

const Store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

export default Store;
