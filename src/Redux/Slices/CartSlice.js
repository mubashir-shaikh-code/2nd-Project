// src/Redux/Slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  sup: 0, // total quantity
};

// Helper to recalc total quantity
const calculateTotalQuantity = (items) =>
  items.reduce((total, item) => total + (item.quantity || 0), 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      if (!item) return;

      // ✅ normalize productId
      const productId = item._id || item.id;
      if (!productId) return;

      // ✅ check if exists
      const index = state.cartItems.findIndex(
        (i) => (i._id || i.id) === productId
      );

      if (index !== -1) {
        // already exists → increase quantity
        state.cartItems[index].quantity = Math.max(
          1,
          state.cartItems[index].quantity + 1
        );
      } else {
        // add new with normalized fields
        state.cartItems.push({
          ...item,
          _id: productId,
          id: productId,
          price: Number(item.price) || 0,
          quantity: 1,
        });
      }

      state.sup = calculateTotalQuantity(state.cartItems);
    },

    removeFromCart(state, action) {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => (item._id || item.id) !== itemId
      );
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
