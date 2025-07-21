import React, { useState } from 'react';
import { FaUser, FaAt, FaLock } from 'react-icons/fa';
import bgImage from '../assets/hero.jpg';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/Slices/AuthSlice';

const ADMIN_EMAIL = 'admin@liflow.com';
const ADMIN_PASS = 'admin123';

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePic: null,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profilePic' && files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Handle admin login directly in frontend
    if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASS) {
      const adminUser = {
        username: 'Admin',
        email: ADMIN_EMAIL,
        profilePic: null,
        isAdmin: true,
      };

      dispatch(loginSuccess({ user: adminUser, token: 'admin-token' }));
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
      return;
    }

    // ✅ Handle user login/registration via API
    try {
      const endpoint = isSignIn ? '/api/auth/login' : '/api/auth/register';
      const payload = isSignIn
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(
        `https://2nd-project-backend-production.up.railway.app${endpoint}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Something went wrong');
        return;
      }

      if (!isSignIn) {
        alert('Registration successful! Please sign in.');
        setIsSignIn(true);
        return;
      }

      const user = { ...data.user, isAdmin: false };
      dispatch(loginSuccess({ user, token: data.token }));
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAdmin', 'false');
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      alert('Server error. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl text-center font-bold text-black">
          {isSignIn ? 'SIGN IN' : 'SIGN UP'}
        </h1>
        <div
          className="h-2 w-10 bg-black rounded-full mx-auto my-4 transition-transform duration-500"
          style={{ transform: isSignIn ? 'translateX(35px)' : 'translateX(0px)' }}
        ></div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <>
              <div className="flex items-center bg-gray-100 p-3 rounded-md">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="bg-transparent flex-1 outline-none text-lg"
                  required
                />
              </div>

              <div className="flex items-center bg-gray-100 p-3 rounded-md">
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleChange}
                  className="text-sm text-gray-700"
                />
              </div>
            </>
          )}

          <div className="flex items-center bg-gray-100 p-3 rounded-md">
            <FaAt className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="bg-transparent flex-1 outline-none text-lg"
              required
            />
          </div>

          <div className="flex items-center bg-gray-100 p-3 rounded-md">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="bg-transparent flex-1 outline-none text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            {isSignIn ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignIn ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-black font-semibold mt-1 cursor-pointer"
          >
            {isSignIn ? 'Go to Sign Up' : 'Go to Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
