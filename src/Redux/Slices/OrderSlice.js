import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🔄 Place an order
export const placeOrder = createAsyncThunk('orders/placeOrder', async ({ orderData, token }) => {
  const res = await axios.post('https://2nd-project-backend-production.up.railway.app/api/orders/place', orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

// 👤 Get orders for logged-in user
export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders', async (token) => {
  const res = await axios.get('https://2nd-project-backend-production.up.railway.app/api/orders/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

// 🛠️ Get all orders (admin only)
export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async (token) => {
  const res = await axios.get('https://2nd-project-backend-production.up.railway.app/api/orders/admin', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

// 🚚 Update order status (admin only)
export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({ orderId, status, token }) => {
  const res = await axios.put(`https://2nd-project-backend-production.up.railway.app/api/orders/admin/${orderId}`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    userOrders: [],
    adminOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders.push(action.payload);
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.adminOrders = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.adminOrders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) state.adminOrders[index] = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ordersSlice.reducer;
