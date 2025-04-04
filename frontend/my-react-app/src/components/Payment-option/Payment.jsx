import React from 'react';
import './Payment.css'

const PaymentOptions = () => {
  return (
    <div className="payment-container">
      <h1>Payment Methods</h1>
      <div className="payment-options">
        <div className="payment-method">
          <h3>M-PESA</h3>
          <p>Till Number: 123456<br/>
             Business Name: Gich-Tech</p>
        </div>
        <div className="payment-method">
          <h3>Bank Transfer</h3>
          <p>Bank: KCB Eldoret Branch<br/>
             Account: 1234567890</p>
        </div>
        <div className="payment-method">
          <h3>Cash on Delivery</h3>
          <p>Available within Eldoret Town</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
