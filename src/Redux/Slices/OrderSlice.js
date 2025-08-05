import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// BASE URL
const BASE_URL = 'https://2nd-project-backend-production.up.railway.app/api/orders';

// Thunks

// Create Order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData) => {
    const response = await fetch(`${BASE_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    return data;
  }
);

// Get All Orders (Admin or General)
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async () => {
    const response = await fetch(`${BASE_URL}/`);
    const data = await response.json();
    return data;
  }
);

// Get Orders by User
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (userId) => {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    const data = await response.json();
    return data;
  }
);

// Approve Order (Admin)
export const approveOrder = createAsyncThunk(
  'orders/approveOrder',
  async (orderId) => {
    const response = await fetch(`${BASE_URL}/approve/${orderId}`, {
      method: 'PUT',
    });
    const data = await response.json();
    return data;
  }
);

// Cancel Order (Admin/User)
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId) => {
    const response = await fetch(`${BASE_URL}/cancel/${orderId}`, {
      method: 'PUT',
    });
    const data = await response.json();
    return data;
  }
);

// Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    userOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Approve Order
      .addCase(approveOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })

      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      });
  },
});

export default orderSlice.reducer;
