import React, { useState } from 'react';
import { FaUser, FaAt, FaLock } from 'react-icons/fa';
import bgImage from '../assets/hero.jpg';
import { useNavigate } from 'react-router-dom';

// ✅ Redux
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/Slices/AuthSlice';

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Init redux dispatcher

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePic: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isSignIn ? '/api/auth/login' : '/api/auth/register';

      const bodyData = isSignIn
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await fetch(`https://2nd-project-backend-production.up.railway.app${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Something went wrong');
      } else {
        alert(data.message || 'Success');

        if (!isSignIn) {
          setIsSignIn(true); // switch to sign-in
        } else {
          // ✅ Dispatch user/token to Redux store
          dispatch(loginSuccess({ user: data.user, token: data.token }));

          // Optional: Store in localStorage for persistence after refresh
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);

          // Navigate to home page
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Request failed', error);
      alert('Server error');
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
          style={{
            transform: isSignIn ? 'translateX(35px)' : 'translateX(0px)',
          }}
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
            {isSignIn ? 'Go to Sign Up ' : 'Go to Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
