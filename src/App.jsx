import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();

  // Redux state
  const cartItems = useSelector((state) => state.cart.cartItems);
  const sup = useSelector((state) => state.cart.sup);

  // Get auth info from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isLoggedIn = !!user;

  // Debug logs (optional)
  console.log("isLoggedIn:", isLoggedIn, "| isAdmin:", isAdmin);

  // Handle add to cart
  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  return (
    <>
      {/* Show Navbar only on logged-in user pages */}
      {location.pathname !== '/' && !isAdmin && <Navbar sup={sup} />}

      <Routes>
        {/* Login route */}
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

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminPanel /> : <Navigate to="/" />}
        />

        {/* User Routes */}
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

      {/* Show footer if not on login or admin */}
      {location.pathname !== '/' && !isAdmin && <Footer />}
    </>
  );
};

export default App;
