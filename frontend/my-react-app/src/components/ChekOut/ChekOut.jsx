import React, { useState, useContext, useEffect, useMemo } from "react";
import { useShop } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DELIVERY_LOCATIONS } from "../../Assets/DeliveryData.js";
import "./CheckOut.css";

const Checkout = () => {
  const navigate = useNavigate();
  const {
    cartState,
    all,
    loading,
    placeOrder,
  } = useShop();

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [availablePickupPoints, setAvailablePickupPoints] = useState([]);
  const [availableLandmarks, setAvailableLandmarks] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    county: "",
    selectedStage: "",
    selectedPickup: "",
    deliveryFee: 0,
    orderNotes: "",
  });

  // Debugging logs
  console.log("Initial cartState:", cartState);
  console.log("Initial items:", cartState?.items);

  // Derive cartProducts from context data
  const cartProducts = useMemo(() => {
    console.log("CartState in useMemo:", cartState);
    console.log("All products:", all);

    if (!cartState?.items) {
      console.log("No items found in cart state");
      return [];
    }

    const entries = Object.entries(cartState.items);
    console.log("Cart entries:", entries);

    return entries
      .filter(([_, item]) => {
        console.log("Filtering item:", item);
        return item?.quantity > 0;
      })
      .map(([productId, item]) => {
        console.log("Processing product ID:", productId);
        const productInfo = all.find((p) => p.id.toString() === productId);
        console.log("Found product info:", productInfo);

        if (!productInfo) return null;

        return {
          id: productInfo.id,
          image: productInfo.image,
          name: productInfo.name,
          description: productInfo.description || "",
          price: productInfo.new_price,
          old_price: productInfo.old_price,
          quantity: item.quantity,
          total: productInfo.new_price * item.quantity,
          brand: productInfo.brand || "",
          category: productInfo.category || "",
          subcategory: productInfo.subcategory || "",
          sizes: productInfo.sizes || [],
          selectedSize: item.selectedSize || "",
          status: productInfo.stockStatus || "",
          keyFeatures: productInfo.keyFeatures || [],
        };
      })
      .filter(Boolean);
  }, [all, cartState]);

  // Get delivery stages for selected county
  const deliveryStages = formData.county
    ? DELIVERY_LOCATIONS[formData.county]?.stages || []
    : [];

  // Update delivery fee when stage is selected
  useEffect(() => {
    if (selectedStage) {
      const stage = deliveryStages.find((s) => s.name === selectedStage);
      if (stage) {
        const fee = stage.fee;
        const bulkDiscount = cartProducts.length >= 3 ? stage.bulkDiscount : 0;
        setDeliveryFee(fee - bulkDiscount);

        setFormData((prev) => ({
          ...prev,
          selectedStage: stage.name,
          deliveryFee: fee - bulkDiscount,
        }));
      } else {
        setDeliveryFee(0);
        setFormData((prev) => ({
          ...prev,
          selectedStage: "",
          deliveryFee: 0,
        }));
      }
    }
  }, [selectedStage, deliveryStages, cartProducts.length]);

  // Update available pickup points when county or stage changes
  useEffect(() => {
    if (formData.county && selectedStage) {
      const countyData = DELIVERY_LOCATIONS[formData.county];
      const stageData = countyData?.stages.find((s) => s.name === selectedStage);

      if (stageData) {
        setAvailablePickupPoints(stageData.pickupPoints || []);
        setAvailableLandmarks(stageData.landmarks || []);
      } else {
        setAvailablePickupPoints([]);
        setAvailableLandmarks([]);
      }
    } else {
      setAvailablePickupPoints([]);
      setAvailableLandmarks([]);
    }
  }, [formData.county, selectedStage]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));

    // Reset stage and pickup point when county changes
    if (name === "county") {
      setSelectedStage("");
      setSelectedPickup("");
    }
  };

  // Handle email changes with validation
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, email: value }));

    // Email validation
    if (!value) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  // Handle stage selection
  const handleStageSelect = (stageName) => {
    setSelectedStage(stageName);
    setSelectedPickup("");
    const stageData = DELIVERY_LOCATIONS[formData.county]?.stages.find(
      (s) => s.name === stageName
    );
    if (stageData) {
      setAvailablePickupPoints(stageData.pickupPoints || []);
      setAvailableLandmarks(stageData.landmarks || []);
    }
    setErrors((prev) => ({ ...prev, selectedStage: null }));
  };

  // Handle pickup point selection
  const handlePickupSelect = (e) => {
    const point = e.target.value;
    setSelectedPickup(point);
    setFormData((prev) => ({ ...prev, selectedPickup: point }));
    setErrors((prev) => ({ ...prev, selectedPickup: null }));
  };

  // Handle county selection
  const handleCountySelect = (e) => {
    const selectedCounty = e.target.value;
    setFormData((prev) => ({
      ...prev,
      county: selectedCounty,
    }));
    setSelectedStage("");
    setSelectedPickup("");
    setAvailablePickupPoints([]);
    setAvailableLandmarks([]);
    setErrors((prev) => ({
      ...prev,
      county: null,
      selectedStage: null,
      selectedPickup: null,
    }));
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(?:\+254|0)[17]\d{8}$/.test(formData.phone.trim())) {
      newErrors.phone = "Invalid Kenyan phone number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.county) newErrors.county = "Please select a county";
    if (!selectedStage || !DELIVERY_LOCATIONS[formData.county]?.stages?.some(stage => stage.name === selectedStage)) {
      newErrors.selectedStage = "Please select a valid delivery stage";
    }
    if (!selectedPickup || !availablePickupPoints.includes(selectedPickup)) {
      newErrors.selectedPickup = "Please select a valid pickup point";
    }
    if (!termsAccepted) newErrors.terms = "You must accept the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate order totals safely
  const orderTotal = useMemo(() => {
    if (!cartProducts || cartProducts.length === 0) {
      console.log("No cart products found for total calculation");
      return 0;
    }

    try {
      const total = cartProducts.reduce((total, item) => {
        if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
          console.warn('Invalid item in cart total calculation:', item);
          return total;
        }
        return total + item.price * item.quantity;
      }, 0);

      console.log("Calculated order total:", total);
      return total;
    } catch (error) {
      console.error('Error calculating order total:', error);
      return 0;
    }
  }, [cartProducts]);

  // Calculate grand total safely
  const grandTotal = useMemo(() => {
    try {
      const fee = typeof deliveryFee === 'number' ? deliveryFee : 0;
      return orderTotal + fee;
    } catch (error) {
      console.error('Error calculating grand total:', error);
      return 0;
    }
  }, [orderTotal, deliveryFee]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cartProducts || cartProducts.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Validate order totals
    if (isNaN(orderTotal) || isNaN(grandTotal) || orderTotal <= 0 || grandTotal <= 0) {
      toast.error("Invalid order amounts. Please refresh and try again.");
      console.error("Invalid order totals:", { orderTotal, grandTotal });
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        // Customer Information
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),

        // Delivery Information
        county: formData.county,
        selectedStage: selectedStage,
        selectedPickup: selectedPickup,
        deliveryFee: Number(deliveryFee),
        orderNotes: formData.orderNotes.trim(),

        // Order Totals
        orderTotal: Number(orderTotal),
        grandTotal: Number(grandTotal),

        // Items with validation
        items: cartProducts.map((item) => ({
          id: item.id,
          quantity: Number(item.quantity),
          brand: item.brand || '',
          name: item.name || '',
          description: item.description || '',
          price: Number(item.price),
          selectedSize: item.selectedSize || '',
          keyFeatures: Array.isArray(item.keyFeatures) ? item.keyFeatures : [],
          image: item.image || '',
          category: item.category || '',
          subcategory: item.subcategory || ''
        })),

        // Order Metadata
        orderDate: new Date().toISOString(),
        orderStatus: 'pending',
        paymentStatus: 'awaiting_payment'
      };

      const result = await placeOrder(orderPayload);

      if (result?.success) {
        toast.success("Order placed successfully! Redirecting to order details...");
        navigate('/orders');
      } else {
        throw new Error("Order placement failed");
      }
    } catch (error) {
      console.error('Order placement error:', error);
      if (error.message.includes("Invalid cart amount")) {
        toast.error("Invalid cart amount. Please refresh and try again.");
      } else if (error.message.includes("Authentication required")) {
        toast.error("Please log in to place an order.");
      } else {
        toast.error(error.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="checkout-loading">
        <h2>Loading your cart...</h2>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="delivery-details">
        <h2>Delivery Information</h2>

        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? "error" : ""}
            placeholder="+254 or 07..."
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleEmailChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
          {!!formData.email && !errors.email && (
            <span className="info-text">Email will be used to confirm your Order</span>
          )}
        </div>

        <div className="form-group">
          <label>Delivery County *</label>
          <select
            name="county"
            value={formData.county}
            onChange={handleCountySelect}
            className={errors.county ? "error" : ""}
          >
            <option value="">Select County</option>
            {Object.keys(DELIVERY_LOCATIONS).map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
          {errors.county && <span className="error-text">{errors.county}</span>}
        </div>

        {formData.county && (
          <>
            <div className="delivery-stages-section">
              <h3>Select Delivery Stage *</h3>
              <div className="delivery-info-section">
                <h2 className="section-title">2. DELIVERY DETAILS</h2>

                {/* Delivery Stages as Radio */}
                <div className="delivery-stages">
                  {deliveryStages.map((stage) => (
                    <label
                      key={stage.name}
                      className={`stage-radio ${
                        selectedStage === stage.name ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryStage"
                        value={stage.name}
                        checked={selectedStage === stage.name}
                        onChange={() => handleStageSelect(stage.name)}
                      />
                      <div className="stage-content">
                        <h4>{stage.name}</h4>
                        <p className="stage-fee">
                          Fee: KSH {stage.fee.toLocaleString()}
                        </p>
                        <p className="stage-time">
                          Estimated Time: {stage.estimatedTime}
                        </p>
                        {stage.instructions && (
                          <p className="stage-instructions">
                            {stage.instructions}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Pickup Points Selection */}
            {selectedStage && (
              <div className="pickup-selection">
                <label>Select pickup station</label>
                <select
                  value={selectedPickup}
                  onChange={handlePickupSelect}
                  className={errors.selectedPickup ? "error" : ""}
                >
                  <option value="">Select pickup station</option>
                  {availablePickupPoints.map((point, index) => (
                    <option key={index} value={point}>
                      {point}
                    </option>
                  ))}
                </select>
                {errors.selectedPickup && (
                  <span className="error-text">{errors.selectedPickup}</span>
                )}
              </div>
            )}

            {/* Order Notes */}
            <div className="form-group">
              <label>Order Notes (Optional)</label>
              <textarea
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleInputChange}
                placeholder="Any special instructions..."
                maxLength={500}
              />
            </div>
          </>
        )}
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>

        <div className="cart-items">
          {cartProducts &&
            cartProducts.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>

                  {/* Add size information */}
                  {item.selectedSize && (
                    <div className="item-size">
                      Size: {item.selectedSize}
                    </div>
                  )}

                  {/* Add key features */}
                  {item.keyFeatures && item.keyFeatures.length > 0 && (
                    <div className="item-features">
                      <h5>Key Features:</h5>
                      <ul>
                        {item.keyFeatures.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="item-quantity">Qty: {item.quantity}</div>
                  <div className="item-price">
                    KSH {((item.totalPrice) || (item.price * item.quantity)).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="price-breakdown">
          <div className="price-row">
            <span>Subtotal:</span>
            <span>KSH {orderTotal.toLocaleString()}</span>
          </div>

          <div className="price-row">
            <span>Delivery Fee:</span>
            <span>KSH {(deliveryFee || 0).toLocaleString()}</span>
          </div>

          <div className="price-row grand-total">
            <span>Total:</span>
            <span>KSH {grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="terms-section">
          <label className="terms-check">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            I agree to the terms and conditions *
          </label>
          {errors.terms && (
            <div className="error-text" style={{ color: "red", fontWeight: "bold" }}>
              {errors.terms}
            </div>
          )}
        </div>

        <button
          className="place-order-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
        <div className="checkout-actions">
          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/")}
          >
            ← Continue Shopping
          </button>
        </div>

        <div className="delivery-info-note">
          <p>* Email Used To LogIn Should Be used When placing Order</p>
          <p>* Make Payment before delivery</p>
          <p>* Cash on delivery for people within Eldoret</p>
          <p>* Payment Is through Mpesa till number or Paybill will be Provided</p>
          <p>* We will Send an Email or SMS to confirm your order and payment details</p>
          <p>* Delivery times may vary based on location and weather conditions</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
