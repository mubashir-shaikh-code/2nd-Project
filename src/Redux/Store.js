  import { configureStore } from '@reduxjs/toolkit';
  import productReducer from './Slices/ProductSlice';
  import cartReducer from './Slices/CartSlice';
  import authReducer from './Slices/AuthSlice';
  import orderReducer from './Slices/OrderSlice';

  const Store = configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
      products: productReducer,
      orders: orderReducer,
    },
  });

  export default Store;