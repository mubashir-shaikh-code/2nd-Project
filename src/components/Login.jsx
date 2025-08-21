import React, { useState, useEffect } from "react";
import { FaUser, FaAt, FaLock } from "react-icons/fa";
import bgImage from "../assets/hero.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../Redux/Slices/AuthSlice";
import OtpModal from "./OtpModal";
import ResetPassword from "./ResetPassword";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const API_URL = "http://localhost:5000/api/auth";

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [pendingUser, setPendingUser] = useState(null); // ✅ store signup values

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Auto logout if token expired
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded.exp * 1000 < Date.now()) {
          alert("Session expired. Please login again.");
          localStorage.clear();
          navigate("/");
        }
      } catch {
        alert("Invalid token. Please login again.");
        localStorage.clear();
        navigate("/");
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  // ✅ React Query Mutations
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      return data;
    },
    onSuccess: (data) => {
      const user = {
        ...data.user,
        profilePic: data.user.profilePic || null,
        isAdmin: data.isAdmin || false,
      };
      dispatch(loginSuccess({ user, token: data.token }));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAdmin", user.isAdmin ? "true" : "false");
      navigate(user.isAdmin ? "/admin" : "/home");
    },
    onError: (error) => alert(error.message),
  });

  const sendOtpMutation = useMutation({
    mutationFn: async ({ email }) => {
      const res = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to send OTP");
      return data;
    },
    onSuccess: (_, variables) => {
      setOtpEmail(variables.email);
      setShowOtpModal(true);
    },
    onError: (error) => alert(error.message),
  });

  const registerMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      return data;
    },
    onSuccess: () => {
      alert("Registration successful! Please sign in.");
      setIsSignIn(true);
      setPendingUser(null); // ✅ clear after register
    },
    onError: (error) => alert(error.message),
  });

  // ✅ Yup Validation Schema
  const validationSchema = Yup.object({
    username: !isSignIn
      ? Yup.string().required("Username is required")
      : Yup.string(),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // ✅ Forgot password handler
  const handleForgotPassword = async (validateForm, setTouched, email) => {
    setTouched({ email: true }); // show error if empty
    const errors = await validateForm();
    if (errors.email) return; // stop if invalid email

    sendOtpMutation.mutate({ email });
  };

  // ✅ OTP handlers
  const handleOtpSuccess = () => {
    if (pendingUser) {
      registerMutation.mutate(pendingUser);
      setShowOtpModal(false);
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
          {isSignIn ? "SIGN IN" : "SIGN UP"}
        </h1>
        <div
          className="h-2 w-10 bg-black rounded-full mx-auto my-4 transition-transform duration-500"
          style={{
            transform: isSignIn ? "translateX(35px)" : "translateX(0px)",
          }}
        ></div>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            profilePic: null,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (isSignIn) {
              loginMutation.mutate({
                email: values.email,
                password: values.password,
              });
            } else {
              setPendingUser(values); // ✅ save signup values
              sendOtpMutation.mutate({ email: values.email });
            }
          }}
        >
          {({ setFieldValue, values, validateForm, setTouched }) => (
            <Form className="space-y-4">
              {!isSignIn && (
                <>
                  <div className="flex items-center bg-gray-100 p-3 rounded-md">
                    <FaUser className="text-gray-500 mr-2" />
                    <Field
                      type="text"
                      name="username"
                      placeholder="Username"
                      className="bg-transparent flex-1 outline-none text-lg"
                    />
                  </div>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  <div className="flex items-center bg-gray-100 p-3 rounded-md">
                    <input
                      type="file"
                      name="profilePic"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFieldValue("profilePic", reader.result);
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                      className="text-sm text-gray-700"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center bg-gray-100 p-3 rounded-md">
                <FaAt className="text-gray-500 mr-2" />
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="bg-transparent flex-1 outline-none text-lg"
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />

              <div className="flex items-center bg-gray-100 p-3 rounded-md">
                <FaLock className="text-gray-500 mr-2" />
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="bg-transparent flex-1 outline-none text-lg"
                />
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />

              {isSignIn && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() =>
                      handleForgotPassword(validateForm, setTouched, values.email)
                    }
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending || sendOtpMutation.isPending}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
              >
                {isSignIn
                  ? loginMutation.isPending
                    ? "Logging in..."
                    : "Login"
                  : sendOtpMutation.isPending
                  ? "Sending OTP..."
                  : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-black font-semibold mt-1 cursor-pointer"
          >
            {isSignIn ? "Go to Sign Up" : "Go to Sign In"}
          </button>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <OtpModal
          email={otpEmail}
          onSuccess={isSignIn ? handleOtpForResetSuccess : handleOtpSuccess}
          onClose={() => setShowOtpModal(false)}
        />
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <ResetPassword
          email={otpEmail}
          onClose={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
};

export default Login;
