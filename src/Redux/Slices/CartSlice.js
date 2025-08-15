// src/Redux/Slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  sup: 0, // total quantity
};

// Helper to recalculate total quantity
const calculateTotalQuantity = (items) =>
  items.reduce((total, item) => total + (item.quantity || 0), 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      if (!item || !item._id) return;

      const index = state.cartItems.findIndex((i) => i._id === item._id);

      if (index !== -1) {
        state.cartItems[index].quantity = Math.max(1, state.cartItems[index].quantity + 1);
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }

      state.sup = calculateTotalQuantity(state.cartItems);
    },

    removeFromCart(state, action) {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item._id !== itemId);
      state.sup = calculateTotalQuantity(state.cartItems);
    },

    clearCart(state) {
      state.cartItems = [];
      state.sup = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
