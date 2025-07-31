import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { addToCart, clearCart } from './Redux/Slices/CartSlice';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Products from './components/Products';
import AdminPanel from './components/AdminPanel';
import UserDashboard from './components/UserDashboard';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const sup = useSelector((state) => state.cart.sup);

  // ✅ JWT session validation
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 2000 < Date.now();
        if (isExpired) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('isAdmin');
          alert('Session expired. Please log in again.');
        }
      } catch (err) {
        console.error('Token decoding failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
      }
    }
  }, []);

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
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/products" element={<Products addToCart={handleAddToCart} />} />
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
      </Routes>

      {location.pathname !== '/admin' && <Footer />}
    </>
  );
};

export default App;
