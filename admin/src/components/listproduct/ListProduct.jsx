import React, { useEffect, useState } from "react";
import './ListProduct.css';
import { REMOVE_PRODUCT_URL, ALL_PRODUCTS, UPDATE_PRODUCT_URL } from "../../../Config";
import { Search, Edit, Trash2, Eye, Save, X } from "lucide-react";

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedProduct, setEditedProduct] = useState(null);
    const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);

    // Get all products
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(ALL_PRODUCTS);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            let products = [];
            // Check if data is an array, if not, look for an array property or convert to array
            if (Array.isArray(data)) {
                products = data;
            } else if (data && typeof data === 'object') {
                // Check if data has a property that contains the array
                const possibleArrayProps = ['products', 'data', 'items', 'results'];
                
                for (const prop of possibleArrayProps) {
                    if (Array.isArray(data[prop])) {
                        products = data[prop];
                        break;
                    }
                }
                
                if (products.length === 0) {
                    console.error('Received data is not an array and does not contain an array property:', data);
                    setError('The data format received from the server is invalid.');
                }
            } else {
                console.error('Received unexpected data format:', data);
                setError('Received unexpected data format from the server.');
            }
            
            setAllProducts(products);
            setFilteredProducts(products);
            setTotalPages(Math.ceil(products.length / productsPerPage));
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(`Failed to fetch products: ${error.message}`);
            setAllProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Update filtered products when search term changes
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredProducts(allproducts);
        } else {
            const filtered = allproducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
        setCurrentPage(1);
        setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
    }, [searchTerm, allproducts]);

    // Update pagination when products per page changes
    useEffect(() => {
        setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
    }, [filteredProducts, productsPerPage]);

    // Remove Product
    const removeProduct = async (id) => {
        try {
            const response = await fetch(REMOVE_PRODUCT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            await fetchProducts();
        } catch (error) {
            console.error('Error removing product:', error);
            setError(`Failed to remove product: ${error.message}`);
        }
    };

    // Edit Product
    const editProduct = (product) => {
        setEditedProduct({...product});
        setShowEditModal(true);
    };

    // Update Product
    const updateProduct = async () => {
        try {
            setUpdateMessage({ type: '', text: '' });
            
            const response = await fetch(`${UPDATE_PRODUCT_URL}/${editedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedProduct)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            setUpdateMessage({ 
                type: 'success', 
                text: 'Product updated successfully!' 
            });
            
            // Update the products list
            await fetchProducts();
            
            // If the current product is being viewed in the details modal, update it
            if (showDetails && selectedProduct && selectedProduct.id === editedProduct.id) {
                setSelectedProduct({...editedProduct});
            }
            
            // Close the edit modal after a delay
            setTimeout(() => {
                setShowEditModal(false);
                setUpdateMessage({ type: '', text: '' });
            }, 2000);
            
        } catch (error) {
            console.error('Error updating product:', error);
            setUpdateMessage({ 
                type: 'error', 
                text: `Failed to update product: ${error.message}` 
            });
        }
    };

    // Handle input change in edit form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Handle nested objects like warranty
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setEditedProduct({
                ...editedProduct,
                [parent]: {
                    ...editedProduct[parent],
                    [child]: value
                }
            });
        } else {
            // Handle numeric values
            if (name === 'new_price' || name === 'old_price') {
                setEditedProduct({
                    ...editedProduct,
                    [name]: parseFloat(value) || 0
                });
            } else {
                setEditedProduct({
                    ...editedProduct,
                    [name]: value
                });
            }
        }
    };

    // View Product Details
    const viewProductDetails = (product) => {
        setSelectedProduct(product);
        setShowDetails(true);
    };

    // Close Details Modal
    const closeDetails = () => {
        setShowDetails(false);
    };

    // Close Edit Modal
    const closeEditModal = () => {
        setShowEditModal(false);
        setUpdateMessage({ type: '', text: '' });
    };

    // Get current products for pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle products per page change
    const handleProductsPerPageChange = (e) => {
        setProductsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="listproduct">
            <h1>All Product List</h1>
            
            <div className="listproduct-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <Search className="search-icon" size={30} height={30}/>
                </div>
                <div className="products-per-page">
                    <span>Showing product per page</span>
                    <select 
                        value={productsPerPage} 
                        onChange={handleProductsPerPageChange}
                        className="per-page-select"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
            
            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={fetchProducts}>Try Again</button>
                </div>
            ) : filteredProducts.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <>
                    <div className="listproduct-format-main">
                        <p>Products</p>
                        <p>Title</p>
                        <p>New Price</p>
                        <p>Category</p>
                        <p>Actions</p>
                    </div>
                    <div className="listproduct-allproducts">
                        {currentProducts.map((product, index) => (
                            <div key={product.id || index} className="listproduct-format">
                                <img src={product.image} alt={product.name} className="listproduct-product-icon" />
                                <p className="product-title">{product.name}</p>
            
                                <p>KSH{product.new_price}</p>
                                <p>{product.category}</p>
                                <div className="product-actions">
                                    <button 
                                        onClick={() => viewProductDetails(product)} 
                                        className="action-button view-button"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button 
                                        onClick={() => editProduct(product)} 
                                        className="action-button edit-button"
                                        title="Edit Product"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => removeProduct(product.id)} 
                                        className="action-button delete-button"
                                        title="Delete Product"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Pagination */}
                    <div className="pagination">
                        <button 
                            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                            disabled={currentPage === 1}
                            className="page-button prev"
                        >
                            &lt;
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => {
                            // Show 5 page numbers at most
                            if (
                                i === 0 || // First page
                                i === totalPages - 1 || // Last page
                                (i >= currentPage - 2 && i <= currentPage + 2) // 2 pages before and after current
                            ) {
                                return (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            }
                            // Add ellipsis
                            if (i === 1 && currentPage > 3) {
                                return <span key="ellipsis-start" className="ellipsis">...</span>;
                            }
                            if (i === totalPages - 2 && currentPage < totalPages - 2) {
                                return <span key="ellipsis-end" className="ellipsis">...</span>;
                            }
                            return null;
                        })}
                        
                        <button 
                            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                            disabled={currentPage === totalPages}
                            className="page-button next"
                        >
                            &gt;
                        </button>
                    </div>
                </>
            )}
            
            {/* Product Details Modal */}
            {showDetails && selectedProduct && (
                <div className="product-details-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{selectedProduct.name}</h2>
                            <button onClick={closeDetails} className="close-button">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="product-image">
                                <img src={selectedProduct.image} alt={selectedProduct.name} />
                            </div>
                            <div className="product-info">
                                <p><strong>Category:</strong> {selectedProduct.category}</p>
                                <p><strong>Subcategory:</strong> {selectedProduct.subcategory}</p>
                                <p><strong>Brand:</strong> {selectedProduct.brand}</p>
                                <p><strong>Old Price:</strong> KSH{selectedProduct.old_price}</p>
                                <p><strong>New Price:</strong> KSH{selectedProduct.new_price}</p>
                                <p><strong>Short Description:</strong></p>
                                <p>{selectedProduct.shortDescription}</p>
                                <p><strong>Description:</strong></p>
                                <p className="full-description">{selectedProduct.description}</p>
                                {selectedProduct.keyFeatures && selectedProduct.keyFeatures.length > 0 && (
                                    <>
                                        <p><strong>Key Features:</strong></p>
                                        <ul>
                                            {selectedProduct.keyFeatures.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => editProduct(selectedProduct)} className="edit-button">
                                <Edit size={18} /> Edit
                            </button>
                            <button onClick={() => {
                                removeProduct(selectedProduct.id);
                                closeDetails();
                            }} className="delete-button">
                                <Trash2 size={18} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditModal && editedProduct && (
                <div className="edit-product-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit Product</h2>
                            <button onClick={closeEditModal} className="close-button">&times;</button>
                        </div>
                        
                        {updateMessage.text && (
                            <div className={`update-message ${updateMessage.type}`}>
                                {updateMessage.text}
                            </div>
                        )}
                        
                        <div className="modal-body">
                            <div className="edit-form">
                                <div className="form-group">
                                    <label htmlFor="name">Product Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={editedProduct.name || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="new_price">New Price (KSH)</label>
                                        <input
                                            type="number"
                                            id="new_price"
                                            name="new_price"
                                            value={editedProduct.new_price || 0}
                                            onChange={handleInputChange}
                                            min="0"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="old_price">Old Price (KSH)</label>
                                        <input
                                            type="number"
                                            id="old_price"
                                            name="old_price"
                                            value={editedProduct.old_price || 0}
                                            onChange={handleInputChange}
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="category">Category</label>
                                        <input
                                            type="text"
                                            id="category"
                                            name="category"
                                            value={editedProduct.category || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="subcategory">Subcategory</label>
                                        <input
                                            type="text"
                                            id="subcategory"
                                            name="subcategory"
                                            value={editedProduct.subcategory || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="brand">Brand</label>
                                    <input
                                        type="text"
                                        id="brand"
                                        name="brand"
                                        value={editedProduct.brand || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="image">Image URL</label>
                                    <input
                                        type="text"
                                        id="image"
                                        name="image"
                                        value={editedProduct.image || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {editedProduct.image && (
                                        <div className="image-preview">
                                            <img src={editedProduct.image} alt="Product preview" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="shortDescription">Short Description</label>
                                    <input
                                        type="text"
                                        id="shortDescription"
                                        name="shortDescription"
                                        value={editedProduct.shortDescription || ''}
                                        onChange={handleInputChange}
                                        maxLength="160"
                                        required
                                    />
                                    <div className="character-count">
                                        {editedProduct.shortDescription ? editedProduct.shortDescription.length : 0}/160
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="description">Full Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={editedProduct.description || ''}
                                        onChange={handleInputChange}
                                        rows="6"
                                        required
                                    ></textarea>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="stockStatus">Stock Status</label>
                                    <select
                                        id="stockStatus"
                                        name="stockStatus"
                                        value={editedProduct.stockStatus || 'IN_STOCK'}
                                        onChange={handleInputChange}
                                    >
                                        <option value="IN_STOCK">In Stock</option>
                                        <option value="OUT_OF_STOCK">Out of Stock</option>
                                        <option value="PREORDER">Pre-order</option>
                                        <option value="BACKORDER">Backorder</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="warranty.hasCoverage">Warranty</label>
                                    <div className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            id="warranty.hasCoverage"
                                            name="warranty.hasCoverage"
                                            checked={editedProduct.warranty?.hasCoverage || false}
                                            onChange={(e) => setEditedProduct({
                                                ...editedProduct,
                                                warranty: {
                                                    ...editedProduct.warranty,
                                                    hasCoverage: e.target.checked
                                                }
                                            })}
                                        />
                                        <label htmlFor="warranty.hasCoverage" className="checkbox-label">Has Warranty</label>
                                    </div>
                                    
                                    {editedProduct.warranty?.hasCoverage && (
                                        <>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor="warranty.durationMonths">Duration (Months)</label>
                                                    <input
                                                        type="number"
                                                        id="warranty.durationMonths"
                                                        name="warranty.durationMonths"
                                                        value={editedProduct.warranty?.durationMonths || 0}
                                                        onChange={handleInputChange}
                                                        min="0"
                                                    />
                                                </div>
                                                
                                                <div className="form-group">
                                                    <label htmlFor="warranty.coverageType">Coverage Type</label>
                                                    <select
                                                        id="warranty.coverageType"
                                                        name="warranty.coverageType"
                                                        value={editedProduct.warranty?.coverageType || 'STANDARD'}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="STANDARD">Standard</option>
                                                        <option value="EXTENDED">Extended</option>
                                                        <option value="LIMITED">Limited</option>
                                                        <option value="LIFETIME">Lifetime</option>
                                                        <option value="MANUFACTURER">Manufacturer</option>
                                                        <option value="STORE">Store</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div className="form-group">
                                                <label htmlFor="warranty.description">Warranty Description</label>
                                                <textarea
                                                    id="warranty.description"
                                                    name="warranty.description"
                                                    value={editedProduct.warranty?.description || ''}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                ></textarea>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button onClick={closeEditModal} className="cancel-button">
                                <X size={18} /> Cancel
                            </button>
                            <button onClick={updateProduct} className="save-button">
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListProduct;