import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSignup from "../components/AdminSignup/AdminSignup";
import AdminLogin from "../components/AdminLogin/AdminLogin";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4006/admin/dashboard", {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setCurrentAdmin({ email: data.admin?.email });
        localStorage.setItem('isAdmin', 'true');
      } else {
        handleLogout();
      }
    } catch (err) {
      handleLogout();
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:4006/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      localStorage.setItem("auth-token", `Bearer ${result.token}`);
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminEmail", email);
      
      setCurrentAdmin({ email });
      setIsLoggedIn(true);
      setError("");

      navigate("/adminpanel");
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const handleSignup = async (email, password) => {
    try {
      const adminCountResponse = await fetch("http://localhost:4006/admin/count");
      const { count } = await adminCountResponse.json();

      if (count >= 4) {
        throw new Error("Maximum of 4 admins already registered.");
      }

      const response = await fetch("http://localhost:4006/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }

      setError("");
      setActiveTab("login");
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentAdmin(null);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  if (isLoggedIn) {

  }

  return (
    <div className="auth-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="auth-tabs">
        <button 
          className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button 
          className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveTab('signup')}
        >
          Sign Up
        </button>
      </div>

      <div className="auth-content">
        {activeTab === 'login' ? (
          <AdminLogin onLogin={handleLogin} />
        ) : (
          <AdminSignup onSignup={handleSignup} />
        )}
      </div>
    </div>
  );
};

export default AdminAuth;
