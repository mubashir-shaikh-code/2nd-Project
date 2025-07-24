import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../Redux/Slices/AuthSlice';

const Navbar = ({ sup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const logout = () => {
    localStorage.clear();
    dispatch(logoutAction());
    navigate('/');
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    user ? (
      <div className="flex items-center gap-4">
        {/* Dropdown trigger and menu */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowDropdown(prev => !prev)}
          >
            {user.profilePic && (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="text-sm">{user.username}</span>
          </div>

          {showDropdown && (
            <div className="absolute top-10 right-0 bg-white text-black rounded shadow-md w-40 z-50">
              <Link
                to="/user-dashboard"
                className="block px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={() => setShowDropdown(false)}
              >
                User Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Logout button stays outside dropdown */}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
        >
          Logout
        </button>
      </div>
    ) : null
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
            <li className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {user.profilePic && (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-white">{user.username}</span>
              </div>
              <Link
                to="/user-dashboard"
                className="text-white underline text-sm"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
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