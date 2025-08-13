import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all approved products for homepage
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const res = await fetch('http://localhost:5000/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  }
);

// Fetch products of the currently logged-in user
export const fetchUserProducts = createAsyncThunk(
  'products/fetchUserProducts',
  async (userEmail) => {
    const res = await fetch(
      `http://localhost:5000/api/products/user?userEmail=${encodeURIComponent(userEmail)}`
    );
    if (!res.ok) throw new Error('Failed to fetch user products');
    return await res.json();
  }
);

// Post a new product (with auth token)
export const postProduct = createAsyncThunk(
  'products/postProduct',
  async ({ payload, token }) => {
    const res = await fetch('http://localhost:5000/api/products', {
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

// Update an existing product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updatedData }) => {
    const res = await fetch(
      `http://localhost:5000/api/products/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Product update failed');
    return data;
  }
);

// Slice setup
const productSlice = createSlice({
  name: 'products',
  initialState: {
    allProducts: [],
    userProducts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all approved products
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

      // Fetch user-specific products
      .addCase(fetchUserProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userProducts = action.payload;
      })
      .addCase(fetchUserProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      //Post product
      .addCase(postProduct.fulfilled, (state, action) => {
        state.userProducts.unshift(action.payload);
      })

      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        state.userProducts = state.userProducts.filter(p => p._id !== updated._id);
        state.userProducts.unshift(updated);
      });
  },
});

export default productSlice.reducer;
