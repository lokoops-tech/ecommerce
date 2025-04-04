import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AdminPanel from "./components/Admin/AdminPanel";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import AdminSignup from "./components/AdminSignup/AdminSignup";
import ErrorBoundary from "./components/Error/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // Use state to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  // Effect to sync with localStorage changes (logout, login from another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
   
    

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    setIsLoggedIn(!!isAdmin);
  }, []);

  // Remove debugging log
  // console.log("isLoggedIn:", isLoggedIn);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
  };

  return (
    <ErrorBoundary>
      <div>
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />
        <Routes>
          <Route
            path="/admin"
            element={<Navigate to={isLoggedIn ? "/adminpanel" : "/admin/login"} replace />}
          />

          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin setIsLoggedIn={setIsLoggedIn} />} />

          <Route 
            path="/adminpanel/*" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
