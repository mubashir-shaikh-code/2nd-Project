import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, addToCart } from '../Redux/Slices/CartSlice';
import { usePlaceOrder } from '../Redux/Slices/OrderSlice'; //    React Query hook

const Cart = ({ clear }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [orderPlaced, setOrderPlaced] = React.useState(false);

  const {
    mutate: placeOrder,
    isLoading,
    isError,
    error,
  } = usePlaceOrder(); //    React Query mutation

  const increment = (item) => {
    dispatch(addToCart(item));
  };

  const decrement = (item) => {
    if (item.quantity > 1) {
      dispatch({
        type: 'cart/removeFromCart',
        payload: item._id,
      });
      for (let i = 0; i < item.quantity - 1; i++) {
        dispatch(addToCart(item));
      }
    } else {
      dispatch(removeFromCart(item._id));
    }
  };

  const total = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to place an order.');
      return;
    }

    try {
      for (let i = 0; i < cartItems.length; i++) {
        const orderData = {
          productId: cartItems[i]._id,
          price: cartItems[i].price * cartItems[i].quantity,
        };

        await new Promise((resolve, reject) => {
          placeOrder(
            { orderData, token },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });
      }

      setOrderPlaced(true);
      clear();
    } catch (err) {
      console.error('Order placement failed:', err);
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
                ${(item.price * item.quantity).toFixed(2)}
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
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded cursor-pointer"
            >
              {isLoading ? 'Placing...' : 'Place Order'}
            </button>
          </div>

          {isError && (
            <p className="mt-4 text-red-600 text-sm">
              {error?.message || 'Order failed. Please try again.'}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
