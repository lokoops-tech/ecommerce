import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from 'react-toastify';
import "./AdminSignup.css";
import { API_BASE_URL } from "../../../Config";

const AdminSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Admin account created successfully!");
        event.target.reset();
        
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      } else {
        toast.error(result.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Super Admin Sign Up</h2>
        </div>
        <form onSubmit={handleSignup} className="form">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            className="input"
            disabled={isLoading}
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="input"
            disabled={isLoading}
            minLength={8}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            className="input"
            disabled={isLoading}
            minLength={8}
          />

          <button 
            type="submit" 
            className="button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="loader-icon animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
