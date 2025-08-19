// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hero from '../assets/hero.jpg';
import PostProduct from './PostProduct';
import { useAllProducts } from '../Redux/Slices/ProductSlice';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Fetch page 1 by default (you can change page later for pagination)
  const { data: productsData = {}, isLoading, isError, error } = useAllProducts(1);

  // Extract products array safely
  const allProducts = Array.isArray(productsData.products) ? productsData.products : [];

  const handlePostClick = () => {
    if (!user) {
      alert('Please login first to post a product.');
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <div
        className="relative w-full h-[60vh] bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black bg-opacity-50">
          <h1 className="text-white text-4xl font-bold mb-6">Welcome to LiFlow Store</h1>
          <h1 className="text-white text-20 mb-6">Find Your Style. Shop With Ease</h1>
          <button
            onClick={handlePostClick}
            className="px-6 py-2 bg-white text-black cursor:pointer font-semibold rounded hover:bg-gray-700 hover:text-white transition"
          >
            Post a Product
          </button>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-10 px-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Products</h2>

        {isLoading && <p className="text-center text-gray-500">Loading products...</p>}
        {isError && (
          <p className="text-center text-red-500">
            {error?.message || 'Failed to load products.'}
          </p>
        )}

        {!isLoading && !isError && allProducts.length === 0 && (
          <p className="text-center text-gray-500">No products found.</p>
        )}

        {!isLoading && !isError && allProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.slice(0, 4).map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded-xl shadow text-center flex flex-col items-center"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.description}
                    className="h-40 object-cover mb-4 rounded"
                  />
                )}
                <p className="text-sm text-gray-600 font-semibold">{product.description}</p>
                <p className="text-lg font-bold">${product.price}</p>
              </div>
            ))}
          </div>
        )}

        {/* View All Products Button */}
        <div className="mt-10 text-center">
          <Link to="/products">
            <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
              View All Products
            </button>
          </Link>
        </div>
      </div>

      {/* Post Product Modal */}
      <PostProduct
        show={showModal}
        onClose={() => setShowModal(false)}
        onPosted={() => {
          setShowModal(false);
          window.location.href = '/products';
        }}
      />
    </div>
  );
};

export default Home;
