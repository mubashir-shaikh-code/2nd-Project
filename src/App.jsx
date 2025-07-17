import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // ✅ Redux hooks
import { addItemToCart, clearCart } from './Redux/Slices/CartSlice'; // ✅ Actions
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Products from './components/Products';

const App = () => {
  const location = useLocation(); // For conditional Navbar/Footer

  const dispatch = useDispatch(); // ✅ Dispatch actions
  const cartItems = useSelector((state) => state.cart.cartItems); // ✅ From Redux
  const sup = useSelector((state) => state.cart.sup); // ✅ From Redux

  // Function to add item to cart
  const addToCart = (item) => {
    dispatch(addItemToCart(item));
  };

  return (
    <>
      {location.pathname !== '/' && <Navbar sup={sup} />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
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
