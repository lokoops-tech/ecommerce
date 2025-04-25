import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './All.css';
const API_BASE_URL = "https://ecommerce-axdj.onrender.com";

const All = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(8);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/allproducts`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Check the structure of the response and extract the array
      if (Array.isArray(data)) {
        setAllProducts(data);
      } else if (data && Array.isArray(data.products)) {
        // If data contains a products array property
        setAllProducts(data.products);
      } else if (data && Array.isArray(data.allproducts)) {
        // If data contains an allproducts array property
        setAllProducts(data.allproducts);
      } else if (data && Array.isArray(data.items)) {
        // If data contains an items array property
        setAllProducts(data.items);
      } else {
        console.error("Received data is not in expected format:", data);
        setAllProducts([]); // Set to empty array as fallback
        setError("Data format error");
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error details:", err);
      setError(err.message);
      setAllProducts([]); // Ensure allProducts is always an array
      setLoading(false);
    }
  };

  const loadMore = () => {
    setVisibleProducts(prev => prev + 10);
  };

  const showLess = () => {
    setVisibleProducts(8);
  };

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className='all-products-container'>
        <h1 className='all-products-title'>All Products</h1>
        <p className='all-products-subtitle'>Find your perfect style from our collection</p>
        <div className='all-products-grid'>
          {Array(10).fill(0).map((_, index) => (
            <div key={index} className="all-product-card">
              <div className="skeleton product-image-container"></div>
              <div className="product-details">
                <div className="skeleton h-4 w-3/4 mb-2"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className='all-products-container'>
      <h1 className='all-products-title'>All Products</h1>
      <p className='all-products-subtitle'>Find your perfect style from our products</p>
      
      <div className='all-products-grid'>
        {allProducts.slice(0, visibleProducts).map((product) => {
          const discount = product.old_price
            ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100)
            : 0;

          return (
            <div key={product.id} className='all-product-card'>
              {discount > 0 && <div className="discount-badge">-{discount}%</div>}
              <Link to={`/product/${product.name}-${product.id}`}>
                <img 
                  onClick={handleClick}
                  className="product-image"
                  src={product.image}
                  alt={product.name}
                />
              </Link>
              <div className="all-product-details">
                <h3 className='all-product-name'>{product.name}</h3>
              <div className="product-price-container">
                <div className="product-price-new">Ksh {product.new_price}</div>
                {product.old_price && (
                  <div className="product-price-old">Ksh {product.old_price}</div>
                )}
              </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className='load-more-container'>
        {visibleProducts < allProducts.length ? (
          <button onClick={loadMore} className="load-more-button"> More Products</button>
        ) : (
          visibleProducts > 8 && <button onClick={showLess} className="show-less-button">Show Less</button>
        )}
      </div>
    </div>
  );
};

export default All;
