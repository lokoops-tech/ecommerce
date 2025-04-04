import React from 'react';
import './Offices.css';

const Offices = () => {
    const locations = [
        {
            city: "New York",
            address: "123 Tech Plaza, Manhattan, NY 10001",
            phone: "+1 234 567 8901",
            coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        {
            city: "London",
            address: "456 Innovation Street, London, UK EC1A 1BB",
            phone: "+44 20 7123 4567",
            coordinates: { lat: 51.5074, lng: -0.1278 }
        },
        {
            city: "Tokyo",
            address: "789 Digital Avenue, Shibuya, Tokyo 150-0002",
            phone: "+81 3 1234 5678",
            coordinates: { lat: 35.6762, lng: 139.6503 }
        }
    ];

    return (
        <div className="offices">
            <h1>Our Global Offices</h1>
            <div className="offices-grid">
                {locations.map((office, index) => (
                    <div key={index} className="office-card">
                        <h3>{office.city}</h3>
                        <p>{office.address}</p>
                        <p>Phone: {office.phone}</p>
                        <div className="map-placeholder">
                            {/* Map integration can be added here using Google Maps or similar services */}
                            <p>Map Location: {office.coordinates.lat}, {office.coordinates.lng}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Offices;
