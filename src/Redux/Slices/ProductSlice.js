// src/Redux/Slices/ProductSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products');
  const data = await res.json();
  return data;
});

// Async thunk to post a product
export const postProduct = createAsyncThunk('products/postProduct', async ({ payload, token }) => {
  const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Add this if your backend requires auth
    },
    body: JSON.stringify(payload), // ✅ send only payload, not full object
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to post product');
  }

  const data = await res.json();
  return data;
});


const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Post product
      .addCase(postProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload); // add new product to list
      })
      .addCase(postProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
