import React from 'react';
import './Warranty.css';

const Warranty = () => {
    return (
        <div className="warranty-container">
            <h2>Product Warranty Information</h2>
            <div className="warranty-content">
                <div className="warranty-section">
                    <h3>Standard Warranty Coverage</h3>
                    <ul>
                        <li>12 months manufacturer warranty</li>
                        <li>Coverage for manufacturing defects</li>
                        <li>Free repair or replacement of faulty parts</li>
                        <li>Technical support included</li>
                    </ul>
                </div>
                
                <div className="warranty-section">
                    <h3>How to Claim</h3>
                    <ol>
                        <li>Contact our customer service</li>
                        <li>Provide proof of purchase</li>
                        <li>Describe the issue in detail</li>
                        <li>Follow return instructions if needed</li>
                    </ol>
                </div>

                <div className="warranty-note">
                    <p>* Terms and conditions apply. Please refer to product documentation for detailed warranty information.</p>
                </div>
            </div>
        </div>
    );
};

export default Warranty;