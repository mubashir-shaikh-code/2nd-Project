import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // ✅ Added useLocation
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Products from './components/Products';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [sup, setSup] = useState(0); // shows count in navbar
  const location = useLocation(); // ✅ Get current path

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setSup((prev) => prev + 1);
  };

  const clearCart = () => {
    setCartItems([]);
    setSup(0);
  };

  return (
    <>
      {/* ✅ Show Navbar only when NOT on login page */}
      {location.pathname !== '/' && <Navbar sup={sup} />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              setCartItems={setCartItems}
              setSup={setSup}
              clear={clearCart}
            />
          }
        />
      </Routes>

      {/*Show Footer only when NOT on login page */}
      {location.pathname !== '/' && <Footer />}
    </>
  );
};

export default App;
