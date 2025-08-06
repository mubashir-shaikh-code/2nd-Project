  import { configureStore } from '@reduxjs/toolkit';
  import productReducer from './Slices/ProductSlice';
  import cartReducer from './Slices/CartSlice';
  import authReducer from './Slices/AuthSlice';

  const Store = configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
      products: productReducer,
    },
  });

  export default Store;