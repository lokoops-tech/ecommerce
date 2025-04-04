import React from 'react';
import './Store.css'

const StoreLocations = () => {
  return (
    <div className="locations-container">
      <h1>Our Store Location</h1>
      <div className="stores-list">
        <div className="store">
          <h3>Eldoret Main Branch</h3>
          <p>Uganda Road, KVDA Plaza, Ground Floor</p>
          <p>Open: Mon-Fri 8AM-6PM</p>
          <p>Saturday: 8AM-4PM</p>
        </div>
        <div className="store">
          <h3>Eldoret West Branch</h3>
          <p>Zion Mall, 1st Floor</p>
          <p>Open: Mon-Sat 8:30AM-6:30PM</p>
        </div>
      </div>
    </div>
  );
};

export default StoreLocations;
