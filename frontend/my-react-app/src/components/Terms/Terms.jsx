import React from 'react';
import './Terms.css'

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <h1>Terms and Conditions</h1>
      
      <div className="terms-content">
        <section>
          <h2>1. Introduction</h2>
          <p>Welcome to Gich-Tech. By accessing and using our website and services, you agree to these terms and conditions.</p>
        </section>

        <section>
          <h2>2. Ordering and Payment</h2>
          <ul>
            <li>All prices are in Kenyan Shillings (KES)</li>
            <li>Orders are confirmed once payment is received</li>
            <li>Payment methods include M-PESA, bank transfers, and cash on delivery (Eldoret only)</li>
            <li>Prices may change without prior notice</li>
          </ul>
        </section>

        <section>
          <h2>3. Delivery</h2>
          <ul>
            <li>Free delivery within Eldoret Town for orders above KES 5,000</li>
            <li>Delivery timeframes are estimates and may vary</li>
            <li>Customer must verify products upon delivery</li>
          </ul>
        </section>

        <section>
          <h2>4. Product Warranty</h2>
          <ul>
            <li>All products carry manufacturer warranty</li>
            <li>Warranty period varies by product category</li>
            <li>Warranty card must be presented for claims</li>
            <li>Physical damage voids warranty</li>
          </ul>
        </section>

        <section>
          <h2>5. Returns and Refunds</h2>
          <ul>
            <li>7-day return policy for unopened items</li>
            <li>Original receipt required for returns</li>
            <li>Refunds processed within 7 working days</li>
            <li>Shipping costs for returns borne by customer unless item is defective</li>
          </ul>
        </section>

        <section>
          <h2>6. Privacy and Data</h2>
          <ul>
            <li>Customer data is collected for order processing</li>
            <li>We maintain customer confidentiality</li>
            <li>Data is not shared with third parties</li>
          </ul>
        </section>

        <section>
          <h2>7. Product Information</h2>
          <ul>
            <li>Product images are for illustration purposes</li>
            <li>Specifications may vary slightly</li>
            <li>Stock availability subject to change</li>
          </ul>
        </section>

        <section>
          <h2>8. Prohibited Activities</h2>
          <ul>
            <li>No unauthorized commercial use of our platform</li>
            <li>No harmful or malicious activities</li>
            <li>No false or misleading information</li>
          </ul>
        </section>

        <section className="terms-footer">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          <p>For any queries regarding these terms, please contact our customer service.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
