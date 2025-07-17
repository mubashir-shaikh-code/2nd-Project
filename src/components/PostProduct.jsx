// src/components/PostProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaDollarSign, FaImage, FaTags } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { postProduct } from '../Redux/Slices/ProductSlice';
import bgImage from '../assets/hero.jpg';

const PostProduct = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    description: '',
    price: '',
    image: null,
    category: 'Electronics',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      if (files[0]) reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      alert('Please log in to post a product.');
      return;
    }

    const payload = {
      ...formData,
      userEmail: user.email,
    };

    try {
      await dispatch(postProduct({ payload, token })).unwrap();
      alert('Product posted successfully!');
      onClose();
      navigate('/products');
    } catch (error) {
      alert(error.message || 'Product post failed.');
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Post a Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-white/80 p-3 rounded-md">
            <FaPen className="text-gray-500 mr-2" />
            <textarea
              name="description"
              placeholder="Product Description"
              required
              onChange={handleChange}
              className="bg-transparent flex-1 outline-none"
            />
          </div>

          <div className="flex items-center bg-white/80 p-3 rounded-md">
            <FaDollarSign className="text-gray-500 mr-2" />
            <input
              type="number"
              name="price"
              placeholder="Price"
              required
              onChange={handleChange}
              className="bg-transparent flex-1 outline-none"
            />
          </div>

          <div className="flex items-center bg-white/80 p-3 rounded-md">
            <FaImage className="text-gray-500 mr-2" />
            <input
              type="file"
              name="image"
              accept="image/*"
              required
              onChange={handleChange}
              className="flex-1 text-sm text-gray-700"
            />
          </div>

          <div className="flex items-center bg-white/80 p-3 rounded-md">
            <FaTags className="text-gray-500 mr-2" />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="bg-transparent flex-1 outline-none"
            >
              <option value="Electronics">Electronics</option>
              <option value="Mens Clothing">Mens Clothing</option>
              <option value="Womens Clothing">Womens Clothing</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Post Product
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 text-red-600 underline w-full text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PostProduct;
