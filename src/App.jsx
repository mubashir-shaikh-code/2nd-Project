import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
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

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const sup = useSelector((state) => state.cart.sup);
  const [validSession, setValidSession] = useState(false);
  const [hasExpired, setHasExpired] = useState(false);

  // Clear localStorage on first load
  useEffect(() => {
    if (!sessionStorage.getItem('visited')) {
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('token');
      sessionStorage.setItem('visited', 'true');
    }
  }, []);

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;

          if (decoded.exp && decoded.exp < now) {
            // Token expired
            setValidSession(false);
            setHasExpired(true); // show alert
            localStorage.clear();
          } else {
            setValidSession(true);
          }
        } catch (err) {
          console.error('Invalid token:', err);
          setValidSession(false);
          setHasExpired(true); // show alert
          localStorage.clear();
        }
      } else {
        setValidSession(false);
      }
    };

    checkTokenValidity(); // run once on mount

    const interval = setInterval(checkTokenValidity, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasExpired) {
      alert('Session expired. Please log in again.');
      navigate('/');
      setHasExpired(false);
    }
  }, [hasExpired, navigate]);

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isLoggedIn = !!user && validSession;

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  return (
    <>
      {location.pathname !== '/' && !isAdmin && <Navbar sup={sup} />}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn
              ? isAdmin
                ? <Navigate to="/admin" />
                : <Navigate to="/home" />
              : <Login />
          }
        />

        <Route
          path="/admin"
          element={isLoggedIn && isAdmin ? <AdminPanel /> : <Navigate to="/" />}
        />

        <Route
          path="/home"
          element={isLoggedIn && !isAdmin ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/about"
          element={isLoggedIn && !isAdmin ? <About /> : <Navigate to="/" />}
        />
        <Route
          path="/contact"
          element={isLoggedIn && !isAdmin ? <Contact /> : <Navigate to="/" />}
        />
        <Route
          path="/products"
          element={
            isLoggedIn && !isAdmin ? (
              <Products addToCart={handleAddToCart} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/cart"
          element={
            isLoggedIn && !isAdmin ? (
              <Cart cartItems={cartItems} clear={() => dispatch(clearCart())} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>

      {location.pathname !== '/' && !isAdmin && <Footer />}
    </>
  );
};

export default App;
