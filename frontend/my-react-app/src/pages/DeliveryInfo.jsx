import React from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Truck, 
  Globe, 
  PhoneCall, 
  Mail, 
  CreditCard ,
  MessageCircle 
} from 'lucide-react';
import './Delivery.css';

const GichTechPolicies = () => {
  return (
    <div className="gich-tech-delivery-container">
      
      <section className="warranty-section">
        <div className="section-header">
          <ShieldCheck className="section-icon" />
          <h2>Product Warranty</h2>
        </div>
        <div className="policy-grid">
          <div className="policy-card">
            <h3>Comprehensive Warranty</h3>
            <p>
              We stand behind the quality of our products with a comprehensive warranty:
              - 1-year warranty on most electronic devices
              - Covers manufacturing defects
              - Free repairs or replacements
            </p>
          </div>
          <div className="policy-card">
            <h3>Warranty Coverage</h3>
            <p>
              Our warranty includes:
              - Protection against technical malfunctions
              - Software and hardware issues
              - Professional assessment and repair
              - Genuine replacement parts
            </p>
          </div>
        </div>
      </section>

      <section className="return-policy-section">
        <div className="section-header">
          <RefreshCw className="section-icon" />
          <h2>Return Policy</h2>
        </div>
        <div className="policy-grid">
          <div className="policy-card">
            <h3>Return Guidelines</h3>
            <p>
              We offer a hassle-free return process:
              - Returns accepted within 7 days of purchase
              - Product must be in original, unused condition
              - Original packaging and accessories must be intact
              - Proof of purchase required
            </p>
          </div>
          <div className="policy-card">
            <h3>Conditions for Return</h3>
            <p>
              Non-returnable items:
              - Customized or personalized products
              - Opened software or digital products
              - Hygiene and personal care items
              - Clearance or final sale items
            </p>
          </div>
        </div>
      </section>

      <section className="delivery-coverage">
        <div className="section-header">
          <Globe className="section-icon" />
          <h2>Nationwide Delivery Coverage</h2>
        </div>
        <p className="description">
          We proudly serve all 47 counties across Kenya, ensuring that no matter where you are, 
          Gich Tech delivers quality products right to your doorstep. Our extensive delivery 
          network connects urban centers and remote areas alike, bringing technology and 
          convenience to every corner of the country.
        </p>

     
      </section>
      <div className="payment-card">
      <CreditCard className="payment-icon" />
      <div className="payment-content">
        <h3 className="payment-title">Secure Payments</h3>
        <p className="payment-description">
          Multiple payment options<br />
          M-Pesa and Bank Transfers<br />
          Secure transaction guaranteed
        </p>
      </div>
    </div>

      <section className="contact-section">
        <div className="section-header">
          <MessageCircle className="section-icon" />
          <h2>Contact Us for Policies</h2>
        </div>
        <div className="contact-methods">
          <div className="contact-card">
            <PhoneCall className="contact-icon" />
            <div className="contact-details">
              <h3>Phone</h3>
              <p>0718315313</p>
            </div>
          </div>
          <div className="contact-card">
            <Mail className="contact-icon" />
            <div className="contact-details">
              <h3>Email</h3>
              <p>gichtechsupport@gmail.com</p>
            </div>
          </div>
          <div className="contact-card">
            <MessageCircle className="contact-icon" />
            <div className="contact-details">
              <h3>WhatsApp</h3>
              <p>0718315313</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GichTechPolicies;