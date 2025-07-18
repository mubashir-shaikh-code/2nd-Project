// redux/slices/cartslice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  sup: 0, // cart count
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existingItem = state.cartItems.find((i) => i._id === item._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }

      // Update total count
      state.sup = state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    removeFromCart(state, action) {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item._id !== itemId);

      // Update total count
      state.sup = state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    clearCart(state) {
      state.cartItems = [];
      state.sup = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
