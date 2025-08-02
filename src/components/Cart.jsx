import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

const Cart = ({ cartItems, clear }) => {
  const [quantities, setQuantities] = useState(cartItems.map(() => 1));
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (user?._id) {
      setUserId(user._id);
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserId(decoded?.id || decoded?._id);
        } catch (err) {
          console.error('Token decoding failed:', err);
        }
      }
    }
  }, [user]);

  const increment = (index) => {
    setQuantities((prev) => {
      const updated = [...prev];
      updated[index] += 1;
      return updated;
    });
  };

  const decrement = (index) => {
    if (quantities[index] > 1) {
      setQuantities((prev) => {
        const updated = [...prev];
        updated[index] -= 1;
        return updated;
      });
    }
  };

  const total = () => {
    return cartItems.reduce((acc, item, i) => acc + item.price * quantities[i], 0);
  };

  const placeOrder = async () => {
    const token = localStorage.getItem('token');

    if (!token || !userId) {
      setMessage('Please login to place an order.');
      return;
    }

    setLoading(true);
    try {
      const orders = cartItems.map((item, i) => ({
        title: item.title,
        quantity: quantities[i],
      }));

      const res = await axios.post(
        'https://2nd-project-backend-production.up.railway.app/api/delivery/cart',
        { userId, orders },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setMessage('✅ Order placed successfully!');
        clear();
      } else {
        setMessage('⚠️ Something went wrong. Try again.');
      }
    } catch (err) {
      console.error('Order error:', err);
      setMessage('❌ Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-32 pb-16 text-center">
      <h1 className="text-4xl font-bold mb-6">Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-xl text-gray-600">Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap justify-between items-center border-b border-gray-300 py-4 max-w-3xl mx-auto"
            >
              <span className="w-6 text-gray-500">{index + 1}</span>
              <img
                src={item.image}
                alt={item.title}
                className="w-10 h-10 object-cover rounded"
              />
              <span className="hidden sm:inline w-32 truncate">{item.title}</span>
              <span className="w-24 text-sm">${(item.price * quantities[index]).toFixed(2)}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrement(index)}
                  className="bg-black text-white w-8 h-8 rounded-full"
                >
                  -
                </button>
                <span>{quantities[index]}</span>
                <button
                  onClick={() => increment(index)}
                  className="bg-black text-white w-8 h-8 rounded-full"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="mt-10 text-xl">
            <p>Total Products: <strong>{cartItems.length}</strong></p>
            <p>Total Price: <strong>${total().toFixed(2)}</strong></p>
          </div>

          {message && <p className="mt-4 text-blue-600">{message}</p>}

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={clear}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded cursor-pointer"
            >
              Clear Cart
            </button>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded cursor-pointer"
            >
              {loading ? 'Placing...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
