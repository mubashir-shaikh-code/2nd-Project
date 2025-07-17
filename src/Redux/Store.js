import { configureStore } from '@reduxjs/toolkit';
import productReducer from './Slices/ProductSlice';
import cartReducer from './Slices/CartSlice';

const Store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer
  },
});

export default Store;