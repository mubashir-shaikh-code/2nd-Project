import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Fetch all products (admin view or homepage)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  }
);

// ✅ Post new product (user)
export const postProduct = createAsyncThunk(
  'products/postProduct',
  async ({ payload, token }) => {
    const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Product post failed');
    return data.product;
  }
);

// ✅ Product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    allProducts: [],           // all products fetched (admin/homepage)
    approvedProducts: [],      // filtered approved
    pendingProducts: [],       // filtered pending
    userProducts: [],          // current user’s own products
    status: 'idle',
    error: null,
  },
  reducers: {
    filterProductsByUser(state, action) {
      const email = action.payload;
      state.userProducts = state.allProducts.filter(
        (p) => p.userEmail === email
      );
      state.pendingProducts = state.userProducts.filter(
        (p) => p.status === 'pending'
      );
      state.approvedProducts = state.userProducts.filter(
        (p) => p.status === 'approved'
      );
    },
    filterApprovedForHome(state) {
      state.approvedProducts = state.allProducts.filter(
        (p) => p.status === 'approved'
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allProducts = action.payload;
        state.approvedProducts = action.payload.filter(
          (p) => p.status === 'approved'
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // ✅ Post new product
      .addCase(postProduct.fulfilled, (state, action) => {
        state.allProducts.unshift(action.payload);
      });
  },
});

export const { filterProductsByUser, filterApprovedForHome } = productSlice.actions;
export default productSlice.reducer;
