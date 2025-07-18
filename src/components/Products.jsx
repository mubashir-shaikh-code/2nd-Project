import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../Redux/Slices/ProductSlice';
import { addToCart } from '../Redux/Slices/CartSlice'; // ✅ Import the Redux action

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Mens Clothing', 'Womens Clothing'];

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item)); // ✅ Dispatch directly here
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-6">Products</h1>

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded border ${
              selectedCategory === cat ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((item, i) => (
            <div
              key={i}
              className="border p-4 rounded-xl shadow text-center flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.description}
                className="h-40 object-cover mb-4 rounded"
              />
              <p className="font-semibold">{item.description}</p>
              <p className="text-gray-500 mb-2">Category: {item.category}</p>
              <p className="text-lg font-bold">${item.price}</p>
              <button
                onClick={() => handleAddToCart(item)}
                className="mt-3 bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
