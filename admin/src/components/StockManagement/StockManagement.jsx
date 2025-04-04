import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, Search, RefreshCw, X } from 'lucide-react';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './StockManagement.css';
import { ALL_PRODUCTS, API_BASE_URL} from '../../../Config';

const STOCK_STATUSES = {
    IN_STOCK: 'IN_STOCK',
    OUT_OF_STOCK: 'OUT_OF_STOCK'
};

const StockStatusBadge = ({ status }) => (
    <span className={`stock-badge ${status === STOCK_STATUSES.IN_STOCK ? 'stock-in' : 'stock-out'}`}>
        {status.replace('_', ' ')}
    </span>
);

// Custom toast configuration
const toastConfig = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    closeButton: true
};

const AdminStockManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingProducts, setUpdatingProducts] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Custom toast functions with close button
    const showSuccessToast = (message) => {
        toast.success(message, toastConfig);
    };

    const showErrorToast = (message) => {
        toast.error(message, toastConfig);
    };

    // Function to close all toasts
    const closeAllToasts = () => {
        toast.dismiss();
    };

    //API REQUEST TO GET ALL PRODUCTS
    const fetchProducts = useCallback(async (showToast = false) => {
        try {
            setIsRefreshing(true);
            setError(null);
            const response = await fetch(ALL_PRODUCTS);
            
            if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
            
            const data = await response.json();
            
            // Check if data is an array or extract array from response object
            let productsArray = [];
            
            if (Array.isArray(data)) {
                productsArray = data;
            } else if (data && typeof data === 'object') {
                // Look for common array properties in API responses
                const possibleArrayProps = ['products', 'data', 'items', 'results'];
                
                for (const prop of possibleArrayProps) {
                    if (Array.isArray(data[prop])) {
                        productsArray = data[prop];
                        break;
                    }
                }
                
        
            } else {
                throw new Error('Invalid data format received from server');
            }
            
            const normalizedData = productsArray.map(product => ({
                ...product,
                stockStatus: product.stockStatus || STOCK_STATUSES.IN_STOCK,
                lastUpdated: product.lastUpdated || product.updatedAt || product.createdAt
            }));
            
            setProducts(normalizedData);
            if (showToast) showSuccessToast('Products refreshed successfully');
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            showErrorToast('Failed to fetch products: ' + err.message);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleUpdateStock = async (productId, newStatus) => {
        if (!Object.values(STOCK_STATUSES).includes(newStatus)) {
            showErrorToast('Invalid stock status');
            return;
        }

        setUpdatingProducts(prev => new Set(prev).add(productId));
        
        try {
            const response = await fetch(`${API_BASE_URL}/stockUpdate/product/${productId}/stock`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    stockStatus: newStatus,
                    updatedBy: 'admin',
                    lastUpdated: new Date().toISOString()
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to update stock status: ${response.status}`);
            }
            
            const responseData = await response.json();
            const updatedProduct = responseData.product || responseData;
            
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === productId 
                        ? { ...p, ...updatedProduct }
                        : p
                )
            );
            
            const productName = products.find(p => p.id === productId)?.name || 'Product';
            showSuccessToast(`${productName}: Updated to ${newStatus.replace('_', ' ').toLowerCase()}`);
            
        } catch (err) {
            console.error('Update error:', err);
            showErrorToast('Failed to update stock: ' + err.message);
            await fetchProducts();
        } finally {
            setUpdatingProducts(prev => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
        }
    };

    const filteredProducts = searchTerm
        ? products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.id?.toString() || '').includes(searchTerm)
          )
        : products;

    if (loading) {
        return (
            <div className="loading-container">
                <Loader2 className="loading-spinner" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error loading products</h2>
                <p>{error}</p>
                <button 
                    onClick={() => fetchProducts(true)}
                    className="retry-button"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="header">
                <h1>Product Stock Management</h1>
                <div className="actions">
                    <div className="search-box">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={() => fetchProducts(true)} disabled={isRefreshing} className="refresh-button">
                        <RefreshCw className={isRefreshing ? 'refresh-icon spinning' : 'refresh-icon'} />
                        Refresh
                    </button>
                    <button onClick={closeAllToasts} className="close-toast-button">
                        <X size={16} />
                        Clear Notifications
                    </button>
                </div>
            </div>
            
            <div className="table-container">
                {filteredProducts.length === 0 ? (
                    <div className="no-products">
                        <p>{searchTerm ? 'No products match your search' : 'No products available'}</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product Name</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => {
                                const isUpdating = updatingProducts.has(product.id);
                                const currentStatus = product.stockStatus || STOCK_STATUSES.IN_STOCK;
                                
                                return (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td><StockStatusBadge status={currentStatus} /></td>
                                        <td>{product.lastUpdated ? new Date(product.lastUpdated).toLocaleString() : 'N/A'}</td>
                                        <td>
                                            <button
                                                onClick={() => handleUpdateStock(
                                                    product.id, 
                                                    currentStatus === STOCK_STATUSES.IN_STOCK 
                                                        ? STOCK_STATUSES.OUT_OF_STOCK 
                                                        : STOCK_STATUSES.IN_STOCK
                                                )}
                                                disabled={isUpdating}
                                                className={currentStatus === STOCK_STATUSES.IN_STOCK ? 'out-stock-button' : 'in-stock-button'}
                                            >
                                                {isUpdating ? <Loader2 className="button-spinner" /> : null}
                                                {currentStatus === STOCK_STATUSES.IN_STOCK ? 'Mark Out of Stock' : 'Mark In Stock'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
            <ToastContainer 
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Slide}
            />
        </div>
    );
};

export default AdminStockManagement;