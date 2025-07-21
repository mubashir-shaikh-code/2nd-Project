import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ sup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  const renderLinks = () => (
    <>
      <li><Link onClick={closeMenu} to="/home" className="hover:text-gray-300">Home</Link></li>
      <li><Link onClick={closeMenu} to="/products" className="hover:text-gray-300">Products</Link></li>
      <li><Link onClick={closeMenu} to="/about" className="hover:text-gray-300">About</Link></li>
      <li><Link onClick={closeMenu} to="/contact" className="hover:text-gray-300">Contact</Link></li>

      {user?.isAdmin && (
        <li>
          <Link
            onClick={closeMenu}
            to="/admin"
            className="hover:text-yellow-300 font-semibold"
          >
            Admin Panel
          </Link>
        </li>
      )}

      <li className="relative">
        <Link onClick={closeMenu} to="/cart" className="hover:text-gray-300 text-xl relative">
          <FaShoppingCart />
          {sup > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full px-2 text-xs">
              {sup}
            </span>
          )}
        </Link>
      </li>
    </>
  );

  const renderUserInfo = () => (
    user && (
      <>
        {user.profilePic && (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <span className="text-sm">{user.username}</span>
        <button
          onClick={logout}
          className="ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
        >
          Logout
        </button>
      </>
    )
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white flex items-center justify-between px-6 h-[100px] z-50">
      <div className="text-2xl font-bold">LiFlow Store</div>

      {/* Desktop Menu */}
      <div className="flex-1 flex justify-center">
        <ul className="hidden sm:flex space-x-8 items-center">
          {renderLinks()}
        </ul>
      </div>

      {/* Desktop User Info */}
      <div className="hidden sm:flex items-center gap-2">
        {renderUserInfo()}
      </div>

      {/* Mobile Toggle Button */}
      <div className="sm:hidden text-2xl cursor-pointer" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <ul className="absolute top-[100px] left-0 w-full bg-black flex flex-col items-start p-6 space-y-6 sm:hidden transition-all duration-300">
          {renderLinks()}
          {user && (
            <li className="flex items-center gap-2">
              {user.profilePic && (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm text-white">{user.username}</span>
              <button
                onClick={logout}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
