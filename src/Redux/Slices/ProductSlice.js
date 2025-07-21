import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const res = await fetch('https://2nd-project-backend-production.up.railway.app/api/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  return await res.json();
});

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
        state.allProducts.unshift(action.payload);
      });
  },
});

export default productSlice.reducer;
