import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css'

const API_BASE_URL = "http://localhost:4000"

const ResetPassword = () => {
    const location = useLocation();
    const email = location.state?.email; // Get email from navigation state
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        if (!code || !newPassword) {
            setMessage('Please enter both code and new password');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/reset-password/resetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    code,
                    newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowPopup(true);
                setMessage('Password reset successful!');
                setTimeout(() => {
                    setShowPopup(false);
                    navigate('/login'); // Redirect to login page after successful reset
                }, 3000);
            } else {
                setMessage(data.error || 'Failed to reset password. Please try again.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password">
            <h1>Reset Password</h1>
            <div className="reset-fields">
                <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength="6"
                />
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button 
                    onClick={handleResetPassword}
                    disabled={loading}
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                {message && (
                    <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}

                {showPopup && (
                    <div className="popup">
                        <svg viewBox="0 0 20 20" fill="none">
                            <path
                                d="M16.6666 5L7.49992 14.1667L3.33325 10"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Password Reset Successful!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;