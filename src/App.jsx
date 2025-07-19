import { Routes, Route, useLocation } from 'react-router-dom';
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

  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Calculate total item count for cart icon
  const sup = useSelector((state) => state.cart.sup);

  // Function to add item to cart
  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  return (
    <>
      {location.pathname !== '/' && <Navbar sup={sup} />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products addToCart={handleAddToCart} />} />
        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} clear={() => dispatch(clearCart())} />}
        />
      </Routes>

      {location.pathname !== '/' && <Footer />}
    </>
  );
};

export default App;
