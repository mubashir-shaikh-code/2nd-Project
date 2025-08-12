import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/orders';

//  Place an order
export const placeOrder = createAsyncThunk('orders/placeOrder', async ({ orderData, token }) => {
  const res = await axios.post(`${BASE_URL}/place`, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

//  Get orders for logged-in user
export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders', async (token) => {
  const res = await axios.get(`${BASE_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

// Request cancellation (user)
export const requestOrderCancellation = createAsyncThunk(
  'orders/requestOrderCancellation',
  async ({ orderId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${BASE_URL}/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { orderId, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Cancel request failed');
    }
  }
);

// Get all orders (admin only)
export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async (token) => {
  const res = await axios.get(`${BASE_URL}/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

//  Update order status (admin only)
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status, token }) => {
    const res = await axios.put(`${BASE_URL}/admin/${orderId}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

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
      //  Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch User Orders
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })

      // Request Cancellation
      .addCase(requestOrderCancellation.fulfilled, (state, action) => {
        const { orderId } = action.payload;
        const index = state.userOrders.findIndex((order) => order._id === orderId);
        if (index !== -1) {
          state.userOrders[index].cancellationRequested = true;
        }
      })
      .addCase(requestOrderCancellation.rejected, (state, action) => {
        state.error = action.payload;
      })

      //  Admin: Fetch All Orders
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.adminOrders = action.payload;
      })

      // ✅ Admin: Update Order Status — with cancellation removal logic
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;

        // If cancellation is approved, remove from both panels
        if (updatedOrder.cancelApproved) {
          state.adminOrders = state.adminOrders.filter(o => o._id !== updatedOrder._id);
          state.userOrders = state.userOrders.filter(o => o._id !== updatedOrder._id);
        } else {
          // Otherwise, just update the order in adminOrders
          const index = state.adminOrders.findIndex(o => o._id === updatedOrder._id);
          if (index !== -1) state.adminOrders[index] = updatedOrder;
        }
      });
  },
});

export default ordersSlice.reducer;
