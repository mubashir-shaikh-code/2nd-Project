  import { configureStore } from '@reduxjs/toolkit';
  import productReducer from './Slices/ProductSlice';
  import cartReducer from './Slices/CartSlice';
  import authReducer from './Slices/AuthSlice';
  import ordersReducer from '../Redux/Slices/OrderSlice';

  const Store = configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
      products: productReducer,
      orders: ordersReducer
    },
  });

  export default Store;