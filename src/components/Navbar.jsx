import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../Redux/Slices/AuthSlice';

const Navbar = ({ sup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const logout = () => {
    dispatch(logoutAction()); // ✅ This resets Redux state and localStorage internally
    setShowDropdown(false);
    navigate('/');
  };

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

  const renderUserInfo = () => {
    if (user) {
      const isUserDashboard = location.pathname === '/UserDashboard';

      return (
        <div className="flex items-center gap-4">
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
                  to="/UserDashboard"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => setShowDropdown(false)}
                >
                  User Dashboard
                </Link>
              </div>
            )}
          </div>

          {!isUserDashboard && (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
            >
              Logout
            </button>
          )}
        </div>
      );
    }

    return (
      <button onClick={() => navigate('/login')} 
        className='px-6 py-2 font-semibold cursor-pointer bg-white text-black rounded hover:bg-gray-800 transition'>
        Login / Register
      </button>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white flex items-center justify-between px-6 h-[100px] z-50">
      <div className="text-2xl font-bold">LiFlow Store</div>

      <div className="flex-1 flex justify-center">
        <ul className="hidden sm:flex space-x-8 items-center">
          {renderLinks()}
        </ul>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        {renderUserInfo()}
      </div>

      <div className="sm:hidden text-2xl cursor-pointer" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {isOpen && (
        <ul className="absolute top-[100px] left-0 w-full bg-black flex flex-col items-start p-6 space-y-6 sm:hidden transition-all duration-300">
          {renderLinks()}
          {user ? (
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
                to="/UserDashboard"
                className="text-white underline text-sm"
                onClick={closeMenu}
              >
                Dashboard
              </Link>

              {location.pathname !== '/UserDashboard' && (
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                >
                  Logout
                </button>
              )}
            </li>
          ) : (
            <li>
              <button onClick={() => navigate('/login')}
                className='px-6 py-2 bg-white text-black cursor:pointer rounded hover:bg-gray-800 transition'>
                Login / Register
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
