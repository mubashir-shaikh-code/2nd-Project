// Redux/Slices/productSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Correct route: fetch all products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products');
  const data = await res.json();
  return data;
});

export const postProduct = createAsyncThunk('products/postProduct', async ({ productData, token }) => {
  const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
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

      .addCase(postProduct.fulfilled, (state, action) => {
        state.allProducts.push(action.payload);
      });
  },
});

export default productSlice.reducer;
