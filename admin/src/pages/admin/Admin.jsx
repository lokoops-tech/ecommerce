import Sidebar from '../../components/sidebar/Sidebar';
import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import AdminLogin from '../../components/AdminLogin/AdminLogin';
import AdminSignup from '../../components/AdminSignup/AdminSignup';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("auth-token");
      const isAuthenticated = !!token;
      setIsLoggedIn(isAuthenticated);
      setIsLoading(false);

      // Redirect to adminpanel if logged in and on login/signup pages
      if (isAuthenticated && (location.pathname === "/admin" || location.pathname === "/admin/signup")) {
        navigate("/admin/adminpanel", { replace: true });
      }
      
      // Redirect to login if not authenticated and trying to access protected routes
      if (!isAuthenticated && location.pathname.startsWith("/admin/") && 
          !location.pathname.includes("/signup")) {
        navigate("/admin", { replace: true });
      }
    };

    checkAuthStatus();
  }, [navigate, location.pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // If user is NOT logged in, show login or signup pages
  if (!isLoggedIn) {
    if (location.pathname === "/admin/signup") {
      return (
        <div className="auth-container">
          <AdminSignup setIsLoggedIn={setIsLoggedIn} />
        </div>
      );
    }
    return (
      <div className="auth-container">
        <AdminLogin setIsLoggedIn={setIsLoggedIn} />
      </div>
    );
  }

  // If user is logged in, render the admin panel with sidebar
  return (
    <div className="admin">
      <Sidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;