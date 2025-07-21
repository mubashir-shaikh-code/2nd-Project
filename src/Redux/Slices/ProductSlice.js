import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Async thunk to fetch products (all products from backend)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  }
);

// ✅ Async thunk to post a new product
export const postProduct = createAsyncThunk(
  'products/postProduct',
  async ({ payload, token }) => {
    const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // 🔐 Protected route with JWT
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Product post failed');
    return data.product; // this gets added to redux state
  }
);

// ✅ Product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    allProducts: [],     // contains all products
    status: 'idle',      // loading status
    error: null,         // error if any
  },
  reducers: {
    // You can add reducers like filter by user/email/status if needed
  },
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch Products
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

      // ✅ Post New Product
      .addCase(postProduct.fulfilled, (state, action) => {
        // add to beginning of array
        state.allProducts.unshift(action.payload);
      });
  },
});

export default productSlice.reducer;
