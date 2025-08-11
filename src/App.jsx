import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { addToCart, clearCart } from './Redux/Slices/CartSlice';
import { loadUserFromStorage, logout } from './Redux/Slices/AuthSlice'; 

import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Products from './components/Products';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel'; 
import Profile from './components/Profile'; 

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const sup = useSelector((state) => state.cart.sup);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && typeof token === 'string' && token.split('.').length === 3) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          dispatch(logout());
          alert('Session expired. Please log in again.');
          navigate('/login');
        } else {
          dispatch(loadUserFromStorage()); // ✅ Rehydrate auth state
        }
      } catch (err) {
        console.error('Token decoding failed:', err);
        dispatch(logout());
        navigate('/login');
      }
    } else {
      dispatch(logout()); // clear Redux + localStorage
    }
  }, [dispatch, navigate]);

  const handleAddToCart = (item) => {
    const isLoggedIn = localStorage.getItem('user');
    if (!isLoggedIn) {
      alert('Please log in first to add to cart.');
      return;
    }
    dispatch(addToCart(item));
  };

  return (
    <>
      {location.pathname !== '/admin' && <Navbar sup={sup} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/products"
          element={<Products addToCart={handleAddToCart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              clear={() => dispatch(clearCart())}
              setCartItems={() => {}}
              setSup={() => {}}
            />
          }
        />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/user-panel" element={<UserPanel />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>

      {location.pathname !== '/admin' && <Footer />}
    </>
  );
};

export default App;
