import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { placeOrder } from '../Redux/Slices/OrderSlice';

const Cart = ({ cartItems, clear }) => {
  const [quantities, setQuantities] = useState(cartItems.map(() => 1));
  const [orderPlaced, setOrderPlaced] = useState(false);
  const dispatch = useDispatch();

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

 const handlePlaceOrder = async () => {
  const token = localStorage.getItem('token');

  try {
    for (let i = 0; i < cartItems.length; i++) {
      const orderData = {
        productId: cartItems[i]._id,
        price: cartItems[i].price * quantities[i],
      };

      await dispatch(placeOrder({ orderData, token }));
    }

    setOrderPlaced(true);
    clear();
  } catch (error) {
    console.error('❌ Order placement failed:', error);
    alert('Something went wrong while placing your order. Please try again.');
  }
};


  return (
    <div className="min-h-screen px-4 pt-32 pb-16 text-center">
      <h1 className="text-4xl font-bold mb-6">Cart</h1>

      {orderPlaced ? (
        <div className="text-green-600 text-2xl font-semibold">
          🎉 Order placed successfully! HOOORRAAYY! 🎉
        </div>
      ) : cartItems.length === 0 ? (
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
              <span className="w-24 text-sm">
                ${(item.price * quantities[index]).toFixed(2)}
              </span>

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

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={clear}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded cursor-pointer"
            >
              Clear Cart
            </button>
            <button
              onClick={handlePlaceOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded cursor-pointer"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
