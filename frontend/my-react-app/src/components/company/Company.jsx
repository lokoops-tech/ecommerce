import React from 'react';
import './Company.css';

const Company = () => {
    return (
        <div className="company">
            <h1>Our Company</h1>
            <div className="company-content">
                <h2>Gich-Tech Solutions</h2>
                <p>We are a leading technology company specializing in innovative solutions for businesses and individuals. Our mission is to transform ideas into powerful digital solutions.</p>
                <div className="company-values">
                    <h3>Our Values</h3>
                    <ul>
                        <li>Innovation</li>
                        <li>Excellence</li>
                        <li>Integrity</li>
                        <li>Customer Focus</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Company;
