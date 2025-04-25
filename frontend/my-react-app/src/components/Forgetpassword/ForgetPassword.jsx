import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgetPassword.css';
const API_BASE_URL = "https://ecommerce-axdj.onrender.com";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000); // Hide after 5 seconds
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleRequestCode = async () => {
        if (!email || !validateEmail(email)) {
            showNotification('error', 'Please enter a valid email address!');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/reset-password/forgetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.toLowerCase().trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('success', 'Reset code sent! Check your email.');
                setTimeout(() => {
                    navigate('/reset-password', { state: { email } });
                }, 2000);
            } else {
                showNotification('error', data.error || 'Failed to send reset code. Please try again.');
            }
        } catch (error) {
            console.error('Error requesting code:', error);
            showNotification('error', 'Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            {notification && (
                <div className={`notification-banner notification-${notification.type}`}>
                    <div className="notification-content">
                        <span className="notification-icon">
                            {notification.type === 'success' ? '✓' : '⚠'}
                        </span>
                        <p className="notification-message">{notification.message}</p>
                    </div>
                </div>
            )}

            <h1 className="forgot-password-title">Forgot Password</h1>
            <div className="reset-form">
                <div className="input-group">
                    <input
                        type="email"
                        className="email-input"
                        placeholder="Enter your email.."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <button 
                        className="reset-button"
                        onClick={handleRequestCode}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Get Reset Code'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
