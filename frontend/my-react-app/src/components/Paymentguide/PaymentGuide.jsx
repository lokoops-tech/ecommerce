import React, { useState } from 'react';
import './PaymentGuide.css'

const PaymentGuide = () => {
  const [selectedMethod, setSelectedMethod] = useState('mpesa');

  const mpesaSteps = [
    "Open your M-PESA menu",
    "Select 'Lipa na M-PESA'",
    "Select 'Pay Bill'",
    "Enter Business Number: 123456",
    "Enter Account Number: Your Order ID",
    "Enter Amount",
    "Enter your M-PESA PIN",
    "Confirm the transaction"
  ];

  const bankSteps = [
    "Log in to your bank's online banking platform",
    "Select 'Transfer' or 'Send Money'",
    "Enter Account Number: 1234567890",
    "Bank Name: Example Bank",
    "Branch Code: 001",
    "Enter Amount",
    "Add Reference: Your Order ID",
    "Confirm the transfer"
  ];

  return (
    <div className="payment-container">
      <h2 className="payment-title">Payment Guide</h2>
      
      <div className="payment-buttons">
        <button
          className={`payment-button ${selectedMethod === 'mpesa' ? 'active' : ''}`}
          onClick={() => setSelectedMethod('mpesa')}
        >
          M-PESA
        </button>
        <button
          className={`payment-button ${selectedMethod === 'bank' ? 'active' : ''}`}
          onClick={() => setSelectedMethod('bank')}
        >
          Bank Transfer
        </button>
      </div>

      <div className="payment-content">
        <h3 className="payment-subtitle">
          {selectedMethod === 'mpesa' ? 'M-PESA Payment Steps' : 'Bank Transfer Steps'}
        </h3>
        
        <div className="steps-container">
          {(selectedMethod === 'mpesa' ? mpesaSteps : bankSteps).map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">{index + 1}</div>
              <p className="step-text">{step}</p>
            </div>
          ))}
        </div>

        <div className="important-notes">
          <h4 className="notes-title">Important Notes:</h4>
          <ul className="notes-list">
            <li>Keep your transaction reference for tracking</li>
            <li>Ensure all details are entered correctly</li>
            <li>Payment confirmation may take a few minutes</li>
          </ul>
        </div>

        <div className="support-info">
          <p>Need help? Contact support at support@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGuide;