import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../Redux/Slices/AuthSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = ({ sup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const logout = () => {
    dispatch(logoutAction());
    navigate('/');
  };

  const handleUserPanel = () => {
    navigate('/user-panel');
    setDropdownOpen(false);
  };

   const handleProfile = () => {
    navigate('/Profile');
    setDropdownOpen(false);
  };

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
      return (
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
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

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
              <button
                onClick={handleProfile}
                className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                <AccountCircleIcon sx={{ mr: 1 }} />
                <span>Profile</span>
              </button>

              <button
                onClick={handleUserPanel}
                className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                <DashboardIcon sx={{ mr: 1 }} />
                <span>User Panel</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                <LogoutIcon sx={{ mr: 1 }} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => navigate('/login')}
        className="px-6 py-2 font-semibold cursor-pointer bg-white text-black rounded hover:bg-gray-800 transition"
      >
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
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.profilePic && (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-white">{user.username}</span>
              </div>
              {dropdownOpen && (
                <div className="bg-white text-black rounded shadow-lg mt-2 w-40">
                  <button
                    onClick={() => navigate('./Profile')}
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    <AccountCircleIcon sx={{ mr: 1 }} />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={handleUserPanel}
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    <DashboardIcon sx={{ mr: 1 }} />
                    <span>User Panel</span>
                  </button>

                  <button
                    onClick={logout}
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    <LogoutIcon sx={{ mr: 1 }} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-white text-black rounded hover:bg-gray-800 transition"
              >
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
