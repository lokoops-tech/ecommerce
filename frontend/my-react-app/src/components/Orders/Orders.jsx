import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../Orders/Order.css';

const OrderStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#ff9800',
      processing: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336',
      'pending payment approval': '#ff9800'
    };
    return statusColors[status.toLowerCase()] || '#000';
  };

  return (
    <span 
      className="status-badge"
      style={{ 
        backgroundColor: getStatusColor(status),
        padding: '8px 16px',
        borderRadius: '4px',
        color: 'white',
        fontWeight: 'bold'
      }}
    >
      {status.toUpperCase()}
    </span>
  );
};

const formatPrice = (price) => {
  return price ? price.toLocaleString() : '0';
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();

  const fetchOrders = async () => {
    const authToken = localStorage.getItem('auth-token');
    console.log("Auth Token being sent:", authToken);
    if (!authToken) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://ecommerce-axdj.onrender.com/order/user-orders?page=${currentPage}&status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
     
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log('Orders data:', data.orders); // Debug log
      setOrders(data.orders);
      console.log("Orders API response:", data);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate, currentPage, filter]);

  useEffect(() => {
    console.log("Updated Orders State:", orders);
  }, [orders]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return <div className="orders-loading-spinner"></div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <h3>Error loading orders</h3>
        <p>{error}</p>
        <button onClick={fetchOrders}>Try Again</button>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter;
  });

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Your Orders</h2>
        <div className="filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found</p>
          <Link to="/" className="shop-now-btn">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="orders-table">
            <div className="table-header">
              <span>ORDER NUMBER</span>
              <span>ORDER DATE</span>
              <span>STATUS</span>
              <span>TOTAL PRICE</span>
              <span>ACTIONS</span>
            </div>

            {filteredOrders.map((order) => (
              <div key={order.orderId} className="order-row">
                <div className="order-info">
                  <span className="order-id">#{order.orderId}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <OrderStatusBadge status={order.status} />
                  <span className="order-total">KSH {formatPrice(order.grandTotal)}</span>
                  <button 
                    className="view-details-btn"
                    onClick={() => toggleOrderDetails(order.orderId)}
                  >
                    {expandedOrderId === order.orderId ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                {expandedOrderId === order.orderId && (
                  <div className="order-details">
                    <div className="delivery-info">
                      <h4>Delivery Information</h4>
                      <p><strong>County:</strong> {order.county}</p>
                      <p><strong>Stage:</strong> {order.selectedStage}</p>
                      <p><strong>Pickup Point:</strong> {order.selectedPickup}</p>
                    </div>

                    <div className="items-list">
                      <h4>Ordered Items</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="item-header">
                            <h5>{item.name}</h5>
                            <span className="item-price">KSH {formatPrice(item.price)}</span>
                          </div>
                          {item.description && (
                            <p className="item-description">{item.description}</p>
                          )}
                          <div className="item-details">
                            <span>Quantity: {item.quantity}</span>
                            <span>Subtotal: KSH {formatPrice(item.price * item.quantity)}</span>
                          </div>
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="item-image"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="order-summary">
                      <h4>Order Summary</h4>
                      <div className="total-row">
                        <span>Subtotal:</span>
                        <span>KSH {order.orderTotal.toLocaleString()}</span>
                      </div>
                      <div className="total-row">
                        <span>Delivery Fee:</span>
                        <span>KSH {order.deliveryFee.toLocaleString()}</span>
                      </div>
                      <div className="total-row grand-total">
                        <span>Grand Total:</span>
                        <span>KSH {order.grandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
