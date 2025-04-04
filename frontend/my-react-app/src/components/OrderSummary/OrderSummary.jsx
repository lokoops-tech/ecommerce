import React from "react";

const OrderSummary = ({ cartItems, all, deliveryFee, getTotalCartAmount }) => {
  const orderTotal = getTotalCartAmount();
  const grandTotal = orderTotal + deliveryFee;

  return (
    <div className="order-summary">
      <h2 className="section-title">Order Summary</h2>
      <div className="order-items">
        {Object.entries(cartItems)
          .filter(([_, quantity]) => quantity > 0)
          .map(([productId, quantity]) => {
            const product = all.find((p) => p.id === parseInt(productId));
            return (
              <div key={productId} className="product-summary">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="product-image"
                />
                <div className="product-details">
                  <div className="product-name">{product?.name}</div>
                  <div className="product-price">
                    KSH {product?.new_price.toLocaleString()} x {quantity} piece
                    {quantity > 1 ? "s" : ""} (VAT Exc)
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="order-totals">
        <div className="total-row">
          <span>Order Total</span>
          <span>KSH {orderTotal.toLocaleString()}</span>
        </div>
        <div className="total-row">
          <span>Shipping Cost</span>
          <span>KSH {deliveryFee.toLocaleString()}</span>
        </div>
        <div className="total-row grand-total">
          <span>Grand Total</span>
          <span>KSH {grandTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
