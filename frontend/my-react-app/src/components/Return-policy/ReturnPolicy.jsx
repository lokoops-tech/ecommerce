import React from 'react';
import './ReturnPolicy.css'

const ReturnPolicy = () => {
  return (
    <div className="return-policy-container">
      <h1>Return Policy</h1>
      <div className="return-content">
        <section>
          <h2>Return Period</h2>
          <p>7 days return policy for unopened items</p>
        </section>
        <section>
          <h2>Return Process</h2>
          <ol>
            <li>Contact customer service</li>
            <li>Get return authorization</li>
            <li>Package item securely</li>
            <li>Ship to our returns center</li>
          </ol>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicy;
