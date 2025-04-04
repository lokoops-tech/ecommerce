// Features.jsx
import React from 'react';
import { FaShippingFast, FaDollarSign, FaHeadset } from 'react-icons/fa';
import './Features.css';

const Features = () => {
  return (
    <div className="features-container">
      <div className="feature">
        <FaShippingFast className="feature-icon" />
        <h3>Fast Delivery</h3>
        <p>Get your orders delivered quickly and efficiently.</p>
      </div>
      <div className="feature">
        <FaDollarSign className="feature-icon" />
        <h3>Value for Money</h3>
        <p>Enjoy the best quality at the most affordable prices.</p>
      </div>
      <div className="feature">
        <FaHeadset className="feature-icon" />
        <h3>24/7 Customer Support</h3>
        <p>We are here to assist you anytime, anywhere.</p>
      </div>
    </div>
  );
};

export default Features;
