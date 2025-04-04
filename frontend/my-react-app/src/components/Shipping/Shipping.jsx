import React from 'react';
import { Link } from 'react-router-dom';
import './Shipping.css'

const ShippingInfo = () => {
  return (
    <div className="shipping-container">
      <h1>Shipping Information</h1>
      
      <div className="order-tracking-info">
        <h2>Track Your Order</h2>
        <p>View your order status and shipping details in your account dashboard under "My Orders"</p>
        <Link to="/orders/:orderId" className="track-order-btn">
          Check Order Status <i className="fas fa-arrow-right"></i>
        </Link>
      </div>

      <div className="shipping-content">
        <div className="shipping-process">
          <h2>Shipping Process</h2>
          <ol>
            <li>Place your order and proceed to checkout</li>
            <li>Shipping cost will be calculated based on your location</li>
            <li>Track your order status through your account dashboard</li>
            <li>Receive real-time updates on delivery progress</li>
          </ol>
        </div>

        <div className="shipping-times">
          <h2>Delivery Times</h2>
          <p>Same day delivery available in Eldoret Town</p>
          <p>Next day delivery to Kitale, Kapsabet, and Iten</p>
          <p>2-4 business days for other locations</p>
        </div>

        <div className="shipping-notes">
          <h2>Important Notes</h2>
          <ul>
            <li>Shipping costs are calculated at checkout based on delivery location</li>
            <li>Free shipping available on orders above KES 10,000 within Eldoret</li>
            <li>Order tracking number provided via SMS and email</li>
            <li>Contact our support team for special delivery arrangements</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
