import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './NewsLatter.css';

const API_BASE_URL = "https://ecommerce-axdj.onrender.com";

const ParticleEffect = () => {
  return (
    <div className="particles">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            '--angle': `${Math.random() * 360}deg`,
            '--distance': `${Math.random() * 100 + 50}px`,
            '--delay': `${Math.random() * 0.5}s`
          }}
        />
      ))}
    </div>
  );
};

const News = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [showParticles, setShowParticles] = useState(false);

    // Add cleanup effect to dismiss all toasts when component unmounts
    useEffect(() => {
        return () => {
            // Clear all toasts when component unmounts
            toast.dismiss();
        };
    }, []);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubscribe = async () => {
        if (!email || !validateEmail(email)) {
            toast.error('Please enter a valid email address!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                onClose: () => {}, // Add empty callback to prevent undefined errors
                onOpen: () => {}   // Add empty callback to prevent undefined errors
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.toLowerCase().trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowParticles(true);
                setEmail('');
                toast.success('Successfully subscribed! Be Ready To get Great Deals.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    onClose: () => {}, // Add empty callback to prevent undefined errors
                    onOpen: () => {}   // Add empty callback to prevent undefined errors
                });
                setTimeout(() => setShowParticles(false), 3000);
            } else {
                toast.error(data.error || 'Subscription failed. Please try again.', {
                    position: "top-right",
                    autoClose: 3000,
                    onClose: () => {}, // Add empty callback to prevent undefined errors
                    onOpen: () => {}   // Add empty callback to prevent undefined errors
                });
            }
        } catch (error) {
            console.error('Error subscribing:', error);
            toast.error('Network error. Please check your connection and try again.', {
                position: "top-right",
                autoClose: 3000,
                onClose: () => {}, // Add empty callback to prevent undefined errors
                onOpen: () => {}   // Add empty callback to prevent undefined errors
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubscribe();
        }
    };

    return (
        <div className="news">
            {/* Updated ToastContainer with additional props */}
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                limit={3}
            />
            {showParticles && <ParticleEffect />}
            <h1>Get Exclusive Offers On Your Email</h1>
            <p>Subscribe to our newsletter and stay tuned</p>
            <div className="news-form">
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Enter your email.."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        aria-label="Email address"
                    />
                    <button 
                        onClick={handleSubscribe} 
                        disabled={loading}
                        aria-label={loading ? 'Subscribing...' : 'Subscribe'}
                    >
                        {loading ? (
                            <>
                                <span className="loader"></span>
                                Subscribing...
                            </>
                        ) : (
                            'Subscribe'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default News;
