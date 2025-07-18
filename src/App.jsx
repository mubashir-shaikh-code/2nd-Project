import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart as addToCartAction, clearCart } from './Redux/Slice/CartSlice'; // ✅ Renamed import

import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Products from './components/Products';

const App = () => {
  const location = useLocation();

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const sup = useSelector((state) => state.cart.sup);

  // ✅ Avoid naming conflict
  const handleAddToCart = (item) => {
    dispatch(addToCartAction(item));
  };

  return (
    <>
      {location.pathname !== '/' && <Navbar sup={sup} />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products addToCart={handleAddToCart} />} />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              clear={() => dispatch(clearCart())}
            />
          }
        />
      </Routes>

      {location.pathname !== '/' && <Footer />}
    </>
  );
};

export default App;
