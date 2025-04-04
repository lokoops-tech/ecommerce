import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './LoginSignup.css';
const API_BASE_URL = "http://localhost:4000";

const LoginSignup = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
    general: ""
  });

  // Clear errors when changing mode
  useEffect(() => {
    setErrors({
      email: "",
      password: "",
      username: "",
      general: ""
    });
  }, [mode]);

  // Handle input changes
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Basic client-side validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
      username: "",
      general: ""
    };

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (mode === "Sign Up" && !formData.username) {
      newErrors.username = "Username is required for Sign Up.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Parse and display user-friendly error messages
  const handleApiErrors = (errorMessage) => {
    // Reset previous errors
    setErrors({
      email: "",
      password: "",
      username: "",
      general: ""
    });

    // Check for specific error messages and map them to user-friendly messages
    if (typeof errorMessage === 'string') {
      if (errorMessage.includes("Invalid credentials")) {
        if (mode === "Login") {
          setErrors(prev => ({
            ...prev,
            password: "The password you entered is incorrect.",
            general: "Please check your email and password."
          }));
        } else {
          setErrors(prev => ({ ...prev, general: errorMessage }));
        }
      } else if (errorMessage.includes("Existing user")) {
        setErrors(prev => ({
          ...prev,
          email: "An account with this email already exists.",
          general: "Please try logging in or use a different email."
        }));
      } else if (errorMessage.includes("Account is locked")) {
        setErrors(prev => ({
          ...prev,
          general: "Your account is locked. Please contact support."
        }));
      } else {
        // Default case for other errors
        setErrors(prev => ({ ...prev, general: errorMessage }));
      }
    } else {
      // Default error message
      setErrors(prev => ({
        ...prev,
        general: "An error occurred. Please try again."
      }));
    }
  };

  // Submit handler for both login and signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const url = mode === "Sign Up"
      ? `${API_BASE_URL}/auth/signup`
      : `${API_BASE_URL}/auth/login`;

    // Prepare the body data
    const bodyData =
      mode === "Sign Up"
        ? {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
        : {
          email: formData.email,
          password: formData.password,
        };

    try {
      // Make request
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      console.log("Server response:", data);

      // If response not ok or data.success is false
      if (!response.ok || !data.success) {
        const errorMessage = data.errors || `${mode} failed. Please try again.`;
        handleApiErrors(errorMessage);
        toast.error(mode === "Login" ?
          "Login failed. Please check your credentials." :
          "Sign up failed. Please check your information.");
        return;
      }

      // Clear any errors
      setErrors({
        email: "",
        password: "",
        username: "",
        general: ""
      });

      // Success! Store the token in localStorage
      localStorage.setItem("auth-token", data.token);
      localStorage.setItem("token-expiry", (Date.now() + 720 * 60 * 60 * 1000).toString()); // Set expiry 24 hours from now

      // Debugging logs
      console.log("Token stored in localStorage:", data.token);
      console.log("Token expiry set to:", new Date(Date.now() + 720 * 60 * 60 * 1000));

      toast.success(`${mode} successful! Redirecting...`);

      // Redirect after a small delay, e.g., 1.5 seconds
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.error("Fetch error:", error);
      setErrors(prev => ({
        ...prev,
        general: "Connection error. Please check your internet and try again."
      }));
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Check token expiry before making protected requests
  const checkTokenExpiry = () => {
    const tokenExpiry = localStorage.getItem("token-expiry");
    if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
      // Token has expired, redirect to login
      localStorage.removeItem("auth-token");
      localStorage.removeItem("token-expiry");
      navigate("/login");
      return true; // Token expired
    }
    return false; // Token is valid
  };


  return (
    <div className="loginsignup">
      <ToastContainer />
      <div className="loginsignup-container">
        <h1>{mode}</h1>
        {errors.general && <div className="error-message general-error">{errors.general}</div>}
        <form onSubmit={handleSubmit}>
          {mode === "Sign Up" && (
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={changeHandler}
                className={errors.username ? "input-error" : ""}
              />
              {errors.username && <div className="error-message">{errors.username}</div>}
            </div>
          )}
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={changeHandler}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={changeHandler}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          <button type="submit">{mode}</button>
        </form>

        <p className="auth-links">
          {mode === "Login" ? (
            <>
              <span className="new-customer-text">New Customer?</span>
              <span
                onClick={() => {
                  setMode("Sign Up");
                  setFormData({ username: "", email: "", password: "" });
                }}
                className="link"
              >
                Create an account
              </span>
              <span className="separator">|</span>
              <span onClick={() => navigate("/forgot-password")} className="link">
                Forgot Password?
              </span>
            </>
          ) : (
            <span
              onClick={() => {
                setMode("Login");
                setFormData({ username: "", email: "", password: "" });
              }}
              className="link back-link"
            >
              Back to Login
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;