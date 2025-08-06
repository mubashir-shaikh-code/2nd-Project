import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to place orders
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async ({ cartItems, userId }, { rejectWithValue }) => {
    try {
      const orders = await Promise.all(
        cartItems.map(async (item) => {
          const res = await axios.post('https://2nd-project-backend-production.up.railway.app/api/orders/place', {
            userId,
            productId: item._id,
            quantity: 1,
            price: item.price,
          });
          return res.data;
        })
      );
      return orders;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Order placement failed';
      });
  },
});

export default orderSlice.reducer;
