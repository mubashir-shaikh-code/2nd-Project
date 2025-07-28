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

// ✅ Update product (user edit)
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updatedData }) => {
    const res = await fetch(`https://2nd-project-backend-production.up.railway.app/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Product update failed');

    // Expecting: { updatedProduct: {...} }
    return data.updatedProduct;
  }
);

// ✅ Product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    allProducts: [],
    approvedProducts: [],
    pendingProducts: [],
    userProducts: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    filterProductsByUser(state, action) {
      const email = action.payload;
      state.userProducts = state.allProducts.filter(p => p.userEmail === email);
      state.pendingProducts = state.userProducts.filter(p => p.status === 'pending');
      state.approvedProducts = state.userProducts.filter(p => p.status === 'approved');
    },
    filterApprovedForHome(state) {
      state.approvedProducts = state.allProducts.filter(p => p.status === 'approved');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allProducts = action.payload;
        state.approvedProducts = action.payload.filter(p => p.status === 'approved');
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(postProduct.fulfilled, (state, action) => {
        state.allProducts.unshift(action.payload);
      })

      // ✅ Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated || !updated._id) {
          console.warn("Invalid update payload:", updated);
          return;
        }

        // Update in allProducts
        const allIndex = state.allProducts.findIndex(p => p._id === updated._id);
        if (allIndex !== -1) state.allProducts[allIndex] = updated;

        // Update in userProducts
        const userIndex = state.userProducts.findIndex(p => p._id === updated._id);
        if (userIndex !== -1) state.userProducts[userIndex] = updated;

        // Re-filter approved/pending products
        state.approvedProducts = state.allProducts.filter(p => p.status === 'approved');
        state.pendingProducts = state.allProducts.filter(p => p.status === 'pending');
      });
  },
});

export const { filterProductsByUser, filterApprovedForHome } = productSlice.actions;
export default productSlice.reducer;
