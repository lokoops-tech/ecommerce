import { useState } from 'react';
import './Footer.css';
import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    const [userName, setUserName] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState('');
    const [reviews, setReviews] = useState([]);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const newReview = {
            id: reviews.length + 1,
            user: userName || 'Anonymous',
            rating: userRating,
            comment: userReview,
            date: new Date().toISOString().split('T')[0]
        };
        setReviews([newReview, ...reviews]);
        setUserName('');
        setUserRating(0);
        setUserReview('');
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="footer-container">
    <div className="footer-content-wrapper">
        <div className="footer-left-section">
            <div className="footer-brand-logo">
                <h1>gich-<span></span></h1>
            </div>
            <ul className="footer-nav-links">
                <li><Link className="footer-nav-link" to="/offices">Offices</Link></li>
                <li><Link className="footer-nav-link" to="/about">About</Link></li>
                <li><Link className="footer-nav-link" to="/contact">Contact</Link></li>
                <li><Link className="footer-nav-link" to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link className="footer-nav-link" to="/terms-condition">Terms & Conditions</Link></li>
            </ul>
           
        </div>
        <div className="footer-quick-links-section">
      <h3 className="footer-quick-links-title">Quick Links</h3>
      
      <ul className="footer-quick-links-list">
        
        <li><Link className="footer-nav-link" to="/shipping">Shipping Information</Link></li>
        <li><Link className="footer-nav-link" to="/payment-options">Payment Methods</Link></li>
        <li><Link className="footer-nav-link" to="/warranty">Warranty Policy</Link></li>
        <li><Link className="footer-nav-link" to="/return-policy">Return Policy</Link></li>
        <li><Link className="footer-nav-link" to="/faq">FAQ</Link></li>
        <li><Link className="footer-nav-link" to="/store-locations">Store Locations</Link></li>
        <li><Link className="footer-nav-link" to="/mpesa-guide">M-PESA Payment Guide</Link></li>
      
      </ul>
      <div className="footer-social-icons">
                <a className="footer-social-icon" href="https://instagram.com"><FaInstagram /></a>
                <a className="footer-social-icon" href="https://wa.me/1234567890"><FaWhatsapp /></a>
                <a className="footer-social-icon" href="https://facebook.com"><FaFacebook /></a>
                <a className="footer-social-icon" href="https://twitter.com"><FaTwitter /></a>
                <a className="footer-social-icon" href="https://linkedin.com"><FaLinkedin /></a>
            </div>
    </div>

        <div className="footer-review-section">
            <h3 className="footer-review-title">Leave a Review</h3>
            <form className="footer-review-form" onSubmit={handleReviewSubmit}>
                <input
                    className="footer-review-input"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your Name"
                />
                <div className="footer-rating-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`footer-star-button ${star <= userRating ? 'filled' : ''}`}
                            onClick={() => setUserRating(star)}
                        >
                            ★
                        </button>
                    ))}
                </div>
                <textarea
                    className="footer-review-textarea"
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="Write your review..."
                />
                <button type="submit" className="footer-submit-button">
                    Submit Review
                </button>
            </form>
        </div>
    </div>

    <div className="footer-bottom-section">
        <p className="footer-copyright">&copy; {new Date().getFullYear()} Gich-Tech. All Rights Reserved.</p>
        <p>DESIGNED BY <span className="footer-designer">LOKOOPS</span></p>

    </div>
</div>

    );
};

export default Footer;
