import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, addToCart } from '../Redux/Slices/CartSlice';
import { usePlaceOrder } from '../Redux/Slices/OrderSlice'; // React Query hook

const Cart = ({ clear }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [orderPlaced, setOrderPlaced] = React.useState(false);

  const {
    mutate: placeOrder,
    isLoading,
    isError,
    error,
  } = usePlaceOrder(); // React Query mutation

  // ✅ Increase quantity
  const increment = (item) => {
    dispatch(addToCart(item));
  };

  // ✅ Decrease quantity
  const decrement = (item) => {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      dispatch(removeFromCart(item._id || item.id));
      if (updatedItem.quantity > 0) {
        dispatch(addToCart(updatedItem));
      }
    } else {
      dispatch(removeFromCart(item._id || item.id));
    }
  };

  // ✅ Total Price
  const total = () => {
    return cartItems.reduce(
      (acc, item) => acc + Number(item.price || 0) * (item.quantity || 1),
      0
    );
  };

  // ✅ Place Order
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      alert('Please log in to place an order.');
      return;
    }

    try {
      // 🔥 Normalize items for backend
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id || item._id, // ✅ prefer id (MySQL products table)
          price: Number(item.price) || 0,
          quantity: item.quantity || 1,
        })),
        totalPrice: total(),
      };

      console.log("🛒 Cart items (raw):", cartItems);
      console.log("📦 Final Order Payload (to backend):", orderData);

      placeOrder(orderData, {
        onSuccess: () => {
          setOrderPlaced(true);
          clear();
        },
        onError: (err) => {
          console.error('❌ Order placement failed:', err);
          alert(err.response?.data?.error || err.message || 'Something went wrong while placing your order.');
        },
      });
    } catch (err) {
      console.error('❌ Order placement failed:', err);
      alert(err.message || 'Something went wrong while placing your order.');
    }
  };

  return (
    <div className="min-h-screen px-4 pt-32 pb-16 text-center">
      <h1 className="text-4xl font-bold mb-6">Cart</h1>

      {orderPlaced ? (
        <div className="text-green-600 text-2xl font-semibold">
          Order placed successfully! Visit your Panel for Updates
        </div>
      ) : cartItems.length === 0 ? (
        <p className="text-xl text-gray-600">Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div
              key={item._id || item.id || index}
              className="flex flex-wrap justify-between items-center border-b border-gray-300 py-4 max-w-3xl mx-auto"
            >
              <span className="w-6 text-gray-500">{index + 1}</span>
              <img
                src={item.image}
                alt={item.title || item.description}
                className="w-10 h-10 object-cover rounded"
              />
              <span className="hidden sm:inline w-32 truncate">
                {item.title || item.description}
              </span>
              <span className="w-24 text-sm">
                ${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrement(item)}
                  className="bg-black text-white w-8 h-8 rounded-full"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increment(item)}
                  className="bg-black text-white w-8 h-8 rounded-full"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="mt-10 text-xl">
            <p>
              Total Products: <strong>{cartItems.length}</strong>
            </p>
            <p>
              Total Price: <strong>${total().toFixed(2)}</strong>
            </p>
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
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded cursor-pointer"
            >
              {isLoading ? 'Placing...' : 'Place Order'}
            </button>
          </div>

          {isError && (
            <p className="mt-4 text-red-600 text-sm">
              {error?.response?.data?.error || error?.message || 'Order failed. Please try again.'}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
