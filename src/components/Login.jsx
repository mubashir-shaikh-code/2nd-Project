import React, { useState, useEffect } from 'react';
import { FaUser, FaAt, FaLock } from 'react-icons/fa';
import bgImage from '../assets/hero.jpg';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/Slices/AuthSlice';
import OtpModal from './OtpModal';
import ResetPassword from './ResetPassword'; // ✅ New modal

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePic: null,
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.exp * 1000 < Date.now()) {
          alert('Session expired. Please login again.');
          localStorage.clear();
          navigate('/');
        }
      } catch {
        alert('Invalid token. Please login again.');
        localStorage.clear();
        navigate('/');
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

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

    if (isSignIn) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || 'Something went wrong');
          return;
        }

        const user = {
          ...data.user,
          profilePic: data.user.profilePic || formData.profilePic || null,
          isAdmin: data.isAdmin || false,
        };

        dispatch(loginSuccess({ user, token: data.token }));
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');

        navigate(data.isAdmin ? '/admin' : '/home');
      } catch (error) {
        console.error('Login error:', error);
        alert('Server error. Please try again.');
      }
    } else {
      try {
        const res = await fetch('http://localhost:5000/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          alert(data.message || 'Failed to send OTP');
          return;
        }

        setShowOtpModal(true);
      } catch (error) {
        console.error('OTP error:', error);
        alert('Failed to send OTP');
      }
    }
  };

  const handleOtpSuccess = async () => {
    try {
      const registerRes = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        alert(registerData.error || 'Registration failed');
        return;
      }

      alert('Registration successful! Please sign in.');
      setIsSignIn(true);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Server error during registration');
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      alert('Please enter your email first');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || 'Failed to send OTP');
        return;
      }

      setShowOtpModal(true);
    } catch (error) {
      console.error('Forgot password OTP error:', error);
      alert('Failed to send OTP');
    }
  };

  const handleOtpForResetSuccess = () => {
    setShowOtpModal(false);
    setShowResetModal(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-lg w-full max-w-md mt-20">
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

          {isSignIn && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

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

      {/* ✅ OTP Modal for Forgot Password */}
      {showOtpModal && (
        <OtpModal
          email={formData.email}
          onSuccess={isSignIn ? handleOtpForResetSuccess : handleOtpSuccess}
          onClose={() => setShowOtpModal(false)}
        />
      )}

      {/* ✅ Reset Password Modal */}
      {showResetModal && (
        <ResetPassword
          email={formData.email}
          onClose={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
};

export default Login;
