  import React, { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';
  import heroImg from '../assets/hero.jpg';
  import PostProduct from './PostProduct';

  const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    }, []);

    const handlePostClick = () => {
      if (!user) {
        alert('Please log in to post a product.');
      } else {
        setShowModal(true);
      }
    };

    return (
      <div
        className="relative w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <h1 className="text-white text-4xl font-bold mb-10">Welcome to LiFlow Store</h1>

          <Link to="/products">
            <button className="mt-6 px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-700 transition">
              View Products
            </button>
          </Link>

          <button
            onClick={handlePostClick}
            className="mt-6 px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-700 transition"
          >
            Post a Product
          </button>
        </div>

        {/* Popup Modal */}
        <PostProduct
          show={showModal}
          onClose={() => setShowModal(false)}
          onPosted={() => {
            setShowModal(false);
            window.location.href = '/products'; // ✅ redirect to products page
          }}
        />
      </div>
    );
  };

  export default Home;
