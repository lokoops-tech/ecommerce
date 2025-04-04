
import React from 'react';
import './Privacy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-main">
      <h1 className="privacy-title">Privacy Policy</h1>
      
      <div className="privacy-content">
        <section className="privacy-section">
          <h2 className="section-title">1. Introduction</h2>
          <p className="section-text">
            This Privacy Policy explains how we collect, use, disclose, and protect your personal information in accordance with the Data Protection Act of Kenya (2019). By using our services, you consent to the practices described in this policy.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="section-title">2. Information We Collect</h2>
          <div className="info-card">
            <ul className="info-list">
              <li>Personal identification information (Name, email address, phone number)</li>
              <li>Billing and delivery address</li>
              <li>Payment information (processed through secure payment gateways)</li>
              <li>Shopping preferences and history</li>
              <li>Device information and IP address</li>
              <li>Communication records between you and our customer service</li>
            </ul>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="section-title">3. Purpose of Data Collection</h2>
          <p className="section-text">We collect and process your data for the following purposes:</p>
          <ul className="purpose-list">
            <li>Processing and fulfilling your orders</li>
            <li>Providing customer support</li>
            <li>Improving our services</li>
            <li>Sending important updates about your orders</li>
            <li>Marketing communications (with your explicit consent)</li>
            <li>Compliance with legal obligations</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="section-title">4. Data Protection Measures</h2>
          <div className="info-card">
            <p className="section-text">We implement robust security measures including:</p>
            <ul className="security-list">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure data storage within Kenya or in compliant jurisdictions</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Regular security audits and updates</li>
              <li>Employee training on data protection</li>
            </ul>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="section-title">5. Your Rights</h2>
          <p className="section-text">Under the Data Protection Act 2019, you have the right to:</p>
          <ul className="rights-list">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Object to processing of your data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for marketing communications</li>
            <li>File a complaint with the Data Protection Commissioner</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="section-title">6. Data Retention</h2>
          <p className="section-text">
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law. Transaction records are kept for 7 years as per Kenyan tax regulations.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="section-title">7. Third-Party Sharing</h2>
          <p className="section-text">We may share your data with:</p>
          <ul className="sharing-list">
            <li>Delivery partners for order fulfillment</li>
            <li>Payment processors for transaction processing</li>
            <li>Service providers who assist our operations</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="section-title">8. Contact Information</h2>
          <div className="contact-card">
            <p className="contact-intro">For any privacy-related queries, contact our Data Protection Officer:</p>
            <p className="contact-detail">Email: gichtechsupport@gmail.com</p>
            <p className="contact-detail">Phone:+254718315313</p>
            <p className="contact-detail">Address:24 street, Eldoret,Kenya</p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="section-title">9. Updates to Privacy Policy</h2>
          <p className="section-text">
            We reserve the right to update this privacy policy. Any changes will be posted on this page with a revised date. Significant changes will be notified to you via email.
          </p>
        </section>

        <footer className="privacy-footer">
          <p className="update-text">Last updated: February 6, 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
