import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify'; 
import { RefreshCw, LoaderIcon } from 'lucide-react';
import './viewOrders.css';
import { API_BASE_URL } from "../../../Config";

const formatPrice = (price) => {
    return price ? price.toLocaleString() : '0';
};

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    const ItemDetails = ({ item, formatPrice }) => {
        const [showFullDescription, setShowFullDescription] = useState(false);
        const isLongDescription = item.description && item.description.length > 100;
        const truncatedDescription = isLongDescription 
            ? `${item.description.substring(0, 100)}...` 
            : item.description;
        
        const toggleDescription = () => {
            setShowFullDescription(!showFullDescription);
        };

        return (
            <div className="item-details">
                <p><strong>{item.name}</strong></p>
                <div className="item-description">
                    <p>
                        {isLongDescription && !showFullDescription 
                            ? truncatedDescription 
                            : item.description}
                    </p>
                    {isLongDescription && (
                        <button 
                            className="view-more-btn" 
                            onClick={toggleDescription}
                        >
                            {showFullDescription ? "View Less" : "View More"}
                        </button>
                    )}
                </div>
                <div className="item-specs">
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: KSH {formatPrice(item.price)}</p>
                    <p>Total: KSH {formatPrice(item.price * item.quantity)}</p>
                </div>
            </div>
        );
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem('auth-token');
            if (!authToken) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(
                `${API_BASE_URL}/order/getorders?page=${currentPage}&limit=10`,
                {
                    headers: {
                        'auth-token': authToken
                    }
                }
            );
            
            if (response.status === 401) {
                throw new Error('Your session has expired. Please log in again.');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
                setStatistics(data.statistics);
                setTotalPages(data.pagination.totalPages);
                setError(null);
            } else {
                throw new Error(data.message || "Failed to fetch orders.");
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message || "An error occurred while fetching orders.");
            
            if (err.message.includes('session has expired')) {
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Function to handle refresh button click
    const handleRefresh = () => {
        setRefreshing(true);
        fetchOrders();
        toast.info("Refreshing orders...");
    };

    const filteredOrders = orders.filter((order) =>
        order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            // Optimistic update - update UI immediately
            setOrders(orders.map((order) =>
                order.orderId === orderId ? { ...order, status } : order
            ));
            
            toast.success(`Order status updated to ${status}`);
    
            // API call in background
            const response = await fetch(`${API_BASE_URL}/order/update-order-status/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
    
            const data = await response.json();
    
            if (!data.success) {
                // Revert changes if API call fails
                fetchOrders();
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            fetchOrders();
            toast.error('Update failed. Changes reverted.');
        }
    };
    
    // Function to handle delete button click
    const handleDeleteClick = (order) => {
        // Only allow delete if order status is "delivered"
        if (order.status.toLowerCase() === "delivered") {
            setOrderToDelete(order);
            setShowDeleteConfirm(true);
        } else {
            toast.warning("Only delivered orders can be deleted");
        }
    };

    // Function to close delete confirmation modal
    const closeDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setOrderToDelete(null);
    };

    // Function to actually delete the order
    const deleteOrder = async () => {
        if (!orderToDelete) return;

        try {
            const authToken = localStorage.getItem('auth-token');
            const response = await fetch(`${API_BASE_URL}/order/delete-order/${orderToDelete.orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update orders list by removing the deleted order
                setOrders(orders.filter(order => order.orderId !== orderToDelete.orderId));
                setShowDeleteConfirm(false);
                setOrderToDelete(null);
                // Close the modal if it was open
                if (selectedOrder && selectedOrder.orderId === orderToDelete.orderId) {
                    setSelectedOrder(null);
                }
                toast.success("Order deleted successfully");
                // Refresh statistics after successful deletion
                fetchOrders();
            } else {
                toast.error(data.message || "Failed to delete order");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Delete failed. Changes reverted.');
        }
    };
    
    return (
        <div className="order-list">
            <div className="header-with-refresh">
                <h2>Admin Orders Dashboard</h2>
                <button 
                    className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
                    onClick={handleRefresh}
                    disabled={loading || refreshing}
                    title="Refresh orders"
                >
                    <RefreshCw size={20} />
                    refresh
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    {error.includes('session has expired') && (
                        <button 
                            onClick={() => window.location.href = '/login'}
                            className="login-again-btn"
                        >
                            Login Again
                        </button>
                    )}
                </div>
            )}

            {loading ? (
                <div className="loading-spinner"> <LoaderIcon size={40}/>  </div>
            ) : (
                <>
                    {statistics && (
                        <div className="statistics-panel">
                            <div className="stat-card">
                                <h4>Total Revenue</h4>
                                <p>KSH {statistics.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="stat-card">
                                <h4>Pending Orders</h4>
                                <p>{statistics.pendingOrders}</p>
                            </div>
                            <div className="stat-card">
                                <h4>Average Order Value</h4>
                                <p>KSH {Number(statistics.averageOrderValue).toLocaleString()}</p>
                            </div>
                        </div>
                    )}

                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Search by order ID or customer name"
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Customer Name</th>
                                    <th>Phone Number</th>
                                    <th>County</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order.orderId} className="order-row">
                                            <td>{order.orderId}</td>
                                            <td>{order.orderDate}</td>
                                            <td>{order.name}</td>
                                            <td>{order.phone}</td>
                                            <td>{order.county}</td>
                                            <td>KSH {formatPrice(order.grandTotal)}</td>
                                            <td>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                                                    className={`status-${order.status.toLowerCase()}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleOrderClick(order)}
                                                    className="view-details-btn"
                                                >
                                                    View Details
                                                </button>
                                                {order.status.toLowerCase() === "delivered" && (
                                                    <button
                                                        onClick={() => handleDeleteClick(order)}
                                                        className="delete-order-btn"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="no-orders">
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="pagination-btn"
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="pagination-btn"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>×</button>
                        <h3>Order Details - {selectedOrder.orderId}</h3>
                        <div className="order-details">
                            <div className="customer-info">
                                <h4>Customer Information</h4>
                                <p><strong>Name:</strong> {selectedOrder.name}</p>
                                <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                                <p><strong>Email:</strong> {selectedOrder.email}</p>
                            </div>

                            <div className="delivery-info">
                                <h4>Delivery Information</h4>
                                <p><strong>County:</strong> {selectedOrder.county}</p>
                                <p><strong>Stage:</strong> {selectedOrder.selectedStage}</p>
                                <p><strong>Pickup Point:</strong> {selectedOrder.selectedPickup}</p>
                            </div>

                            <div className="order-items">
                                <h4>Ordered Items</h4>
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="item-card">
                                        {item.image && (
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="item-image"
                                            />
                                        )}
                                        <ItemDetails item={item} formatPrice={formatPrice} />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="order-summary">
                                <h4>Order Summary</h4>
                                <p><strong>Subtotal:</strong> KSH {formatPrice(selectedOrder.orderTotal)}</p>
                                <p><strong>Delivery Fee:</strong> KSH {formatPrice(selectedOrder.deliveryFee)}</p>
                                <p><strong>Grand Total:</strong> KSH {formatPrice(selectedOrder.grandTotal)}</p>
                                <p><strong>Order Notes:</strong> {selectedOrder.orderNotes || 'No notes'}</p>
                                <p><strong>Order Date:</strong> {selectedOrder.orderDate} {selectedOrder.orderTime}</p>
                            </div>
                            
                            {selectedOrder.status.toLowerCase() === "delivered" && (
                                <div className="actions">
                                    <button 
                                        onClick={() => handleDeleteClick(selectedOrder)}
                                        className="delete-order-btn full-width"
                                    >
                                        Delete This Order
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-dialog">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete order #{orderToDelete.orderId}?</p>
                        <p>This action cannot be undone.</p>
                        
                        <div className="confirm-buttons">
                            <button 
                                onClick={closeDeleteConfirm}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={deleteOrder}
                                className="delete-confirm-btn"
                            >
                                Delete Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewOrders;
