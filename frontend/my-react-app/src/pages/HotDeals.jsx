import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import './HotDeals.css';
const API_BASE_URL = "http://localhost:4000";

const HotDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(16);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/product/allproducts`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Extract the array of products from the response
      let productsArray = [];
      
      if (Array.isArray(responseData)) {
        productsArray = responseData;
      } else if (responseData && Array.isArray(responseData.products)) {
        productsArray = responseData.products;
      } else if (responseData && Array.isArray(responseData.allproducts)) {
        productsArray = responseData.allproducts;
      } else if (responseData && Array.isArray(responseData.items)) {
        productsArray = responseData.items;
      } else {
        console.error("Received data is not in expected format:", responseData);
        throw new Error("Invalid data format received from server");
      }
      
      // Filter products with 30% or higher discount
      const filteredProducts = productsArray.filter(product => {
        const discount = product.old_price 
          ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100) 
          : 0;
        return discount >= 30;
      });
      
      // Sort products by discount percentage (highest first)
      const sortedProducts = filteredProducts.sort((a, b) => {
        const discountA = a.old_price ? Math.round(((a.old_price - a.new_price) / a.old_price) * 100) : 0;
        const discountB = b.old_price ? Math.round(((b.old_price - b.new_price) / b.old_price) * 100) : 0;
        return discountB - discountA;
      });
      
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  const loadMore = () => {
    setVisibleProducts(prev => prev + 16);
  };

  // Function to create URL-friendly slug
  const createSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Loading skeleton with fixed dimensions to prevent layout shift
  const renderLoadingSkeleton = () => {
    return Array(16).fill(0).map((_, index) => (
      <div key={index} className="deals-skeleton-card">
        <div className="deals-skeleton-wrapper">
          <div className="deals-skeleton-discount"></div>
          <div className="deals-skeleton-image"></div>
          <div className="deals-skeleton-title"></div>
          <div className="deals-skeleton-price-group">
            <div className="deals-skeleton-current-price"></div>
            <div className="deals-skeleton-original-price"></div>
          </div>
        </div>
      </div>
    ));
  };

  const renderError = () => (
    <div className="deals-error-wrapper">
      <AlertCircle size={48} className="deals-error-icon" />
      <h3 className="deals-error-title">Oops! Something went wrong</h3>
      <p className="deals-error-description">{error}</p>
      <button onClick={fetchProducts} className="deals-retry-btn">
        Try Again
      </button>
    </div>
  );

  const renderProductCard = (product) => {
    const discount = product.old_price
      ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100)
      : 0;
    
    const productSlug = createSlug(product.name);

    return (
      <div key={product.id} className="deals-product-card">
        <div className="deals-product-wrapper">
          <div className="deals-discount-tag">-{discount}%</div>
          <Link 
            to={`/product/${productSlug}-${product.id}`} 
            onClick={handleClick}
            className="deals-product-link"
          >
            <img
              className="deals-product-image"
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
              }}
            />
          </Link>
          <div className="deals-product-info">
            <h4 className="deals-product-title">{product.name}</h4>
          </div>
          <div className="deals-price-container">
            <span className="deals-current-price">
              Ksh {product.new_price.toLocaleString()}
            </span>
            {product.old_price && (
              <span className="deals-original-price">
                Ksh {product.old_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="deals-main-container">
      <div className="deals-header">
        <div className="deals-header-content">
          <h1 className="deals-page-title">Products with High Discount</h1>
        </div>
      </div>

      {error && renderError()}

      <div className="deals-products-grid">
        {loading ? (
          renderLoadingSkeleton()
        ) : products.length > 0 ? (
          products.slice(0, visibleProducts).map(renderProductCard)
        ) : (
          <div className="deals-empty-state">
            <p className="deals-empty-message">
              No products with 50% or higher discount available at the moment.
            </p>
          </div>
        )}
      </div>

      {!loading && !error && products.length > visibleProducts && (
        <div className="deals-load-more">
          <button 
            onClick={loadMore}
            className="deals-load-more-btn"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default HotDeals;