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
import AdminPanel from './components/AdminPanel'; // ✅ Import Admin Pane

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const sup = useSelector((state) => state.cart.sup);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  const isAdmin = localStorage.getItem('isAdmin');

  return (
    <>
      {location.pathname !== '/' && <Navbar sup={sup} />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/products"
          element={<Products addToCart={handleAddToCart} />}
        />
        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} clear={() => dispatch(clearCart())} />}
        />

        {/* ✅ Admin route (protected) */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminPanel /> : <Navigate to="/" />}
        />
      </Routes>

      {location.pathname !== '/' && <Footer />}
    </>
  );
};

export default App;
