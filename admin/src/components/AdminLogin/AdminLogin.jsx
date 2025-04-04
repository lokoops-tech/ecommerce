import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "../AdminLogin/AdminLogin.css";
import { API_BASE_URL } from "../../../Config";

const AdminLogin = ({ setIsLoggedIn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [suggestedEmails, setSuggestedEmails] = useState([]); // ✅ Store past emails
  const [showSuggestions, setShowSuggestions] = useState(false); // ✅ Control dropdown visibility
  const navigate = useNavigate();

  // Load saved emails from localStorage
  useEffect(() => {
    const storedEmails = JSON.parse(localStorage.getItem("savedEmails")) || [];
    setSuggestedEmails(storedEmails);
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem("auth-token", `Bearer ${result.token}`);
        localStorage.setItem("isLoggedIn", "true");

        // ✅ Save email to localStorage if not already saved
        let updatedEmails = [...suggestedEmails];
        if (!updatedEmails.includes(email)) {
          updatedEmails.push(email);
          localStorage.setItem("savedEmails", JSON.stringify(updatedEmails));
        }

        setIsLoggedIn(true);
        toast.success("Login successful!");
        navigate("/admin/adminpanel", { replace: true });
      } else {
        toast.error(result.message || "Incorrect email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email selection from suggestions
  const handleSelectEmail = (selectedEmail) => {
    setEmail(selectedEmail);
    setShowSuggestions(false); // Hide suggestions after selection
  };

  return (
    <div className="container">
      <div className="card">
        <div className="cardHeader">
          <h2 className="cardTitle">Admin Login</h2>
        </div>
        <form onSubmit={handleLogin} className="form">
          <div className="input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="input"
              disabled={isLoading}
              onFocus={() => setShowSuggestions(true)} // ✅ Show dropdown on focus
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // ✅ Hide on blur (with delay)
            />
            {showSuggestions && suggestedEmails.length > 0 && (
              <ul className="suggestions-list">
                {suggestedEmails.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSelectEmail(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="input"
            disabled={isLoading}
          />

          <button 
            type="submit" 
            className="button"
            disabled={isLoading || !email.trim() || !password.trim()}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
