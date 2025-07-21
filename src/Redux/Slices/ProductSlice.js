// Redux/Slices/productSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Async Thunks
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products');
  const data = await res.json();
  return data;
});

export const postProduct = createAsyncThunk('products/postProduct', async ({ payload, token }) => {
  const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    allProducts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allProducts = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Post Product
      .addCase(postProduct.fulfilled, (state, action) => {
        state.allProducts.push(action.payload);
      });
  },
});

export default productSlice.reducer;
