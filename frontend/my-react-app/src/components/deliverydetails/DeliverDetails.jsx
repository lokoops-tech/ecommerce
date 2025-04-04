import React from "react";

const DeliveryDetails = ({
  formData,
  errors,
  handleInputChange,
  handleDeliveryOptionChange,
  deliveryFee,
}) => {
  return (
    <div className="delivery-details">
      <h2 className="section-title">Delivery Details</h2>
      
      {/* Name */}
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={errors.name ? "error" : ""}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      {/* Phone */}
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={errors.phone ? "error" : ""}
        />
        {errors.phone && <span className="error-text">{errors.phone}</span>}
      </div>

      {/* Other form fields */}
      {/* Delivery Options */}
      <h3>Delivery Options:</h3>
      {Object.values(DELIVERY_OPTIONS).map((option) => (
        <div key={option.id} className="delivery-option">
          <input
            type="radio"
            name="deliveryOption"
            value={option.id}
            data-cost={option.cost}
            checked={formData.deliveryOption === option.id}
            onChange={handleDeliveryOptionChange}
          />
          <label>
            {option.label} (Shipping Cost: KSH {option.cost.toLocaleString()})
          </label>
        </div>
      ))}
    </div>
  );
};

export default DeliveryDetails;
