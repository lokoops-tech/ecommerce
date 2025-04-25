import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./YouMaylike.css";
const API_BASE_URL="https://ecommerce-axdj.onrender.com"




const YouMayLike = () => {
  const [products, setProducts] = useState([]);
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
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        // If data contains a products array property
        setProducts(data.products);
      } else if (data && Array.isArray(data.allproducts)) {
        // If data contains an allproducts array property
        setProducts(data.allproducts);
      } else if (data && Array.isArray(data.items)) {
        // If data contains an items array property
        setProducts(data.items);
      } else {
        console.error("Received data is not in expected format:", data);
        setProducts([]); // Set to empty array as fallback
        setError("Data format error");
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error details:", err);
      setError(err.message);
      setProducts([]); // Ensure products is always an array
      setLoading(false);
    }
  };

  const loadMore = () => setVisibleProducts((prev) => prev + 10);
  const showLess = () => setVisibleProducts(8);
  const scrollToTop = () => window.scrollTo(0, 0);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <div className="youmaylike-error-message">{error}</div>;
  }

  return (
    <div className="youmaylike-container">
      <h1>You May Like This</h1>
      <p>Find your perfect products from our shop || Enjoy up to 50% discount</p>

      <div className="youmaylike-products-grid">
        {products.slice(0, visibleProducts).map((product) => (
          <ProductCard key={product.id} product={product} onClick={scrollToTop} />
        ))}
      </div>

      <div className="youmaylike-load-more">
        {visibleProducts < products.length ? (
          <button onClick={loadMore}>Load More</button>
        ) : (
          visibleProducts > 8 && <button onClick={showLess}>Show Less</button>
        )}
      </div>
    </div>
  );
};

// Component: Product Card
const ProductCard = ({ product, onClick }) => {
  const { id, name, image, old_price, new_price } = product;
  const discount = old_price ? Math.round(((old_price - new_price) / old_price) * 100) : 0;
  
  // Create a URL-safe product name by encoding it properly
  const safeProductUrl = `/product/${encodeURIComponent(name)}-${id}`;

  return (
    <div className="youmaylike-product-card">
      {discount > 0 && <div className="youmaylike-discount-badge">-{discount}%</div>}
      <Link to={safeProductUrl} onClick={onClick}>
        <div className="youmaylike-product-image-container">
          <img className="youmaylike-product-image" src={image} alt={name} />
        </div>
      </Link>
      <div className="youmaylike-product-details">
        <h3 className="youmaylike-product-name">{name}</h3>
        <div className="youmaylike-item-price">
          <span className="youmaylike-item-price-new">Ksh {new_price}</span>
          {old_price && <span className="youmaylike-old-price">Ksh {old_price}</span>}
        </div>
      </div>
    </div>
  );
};

// Component: Loading State
const LoadingState = () => {
  return (
    <div className="youmaylike-container">
      <h1>Just For You</h1>
      <p>Find your perfect style from our collection || Products up to 50% off</p>
      <div className="youmaylike-products-grid">
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="youmaylike-product-card youmaylike-skeleton">
              <div className="youmaylike-product-image-container youmaylike-skeleton"></div>
              <div className="youmaylike-product-details">
                <div className="youmaylike-skeleton-line youmaylike-skeleton-line-title"></div>
                <div className="youmaylike-skeleton-line youmaylike-skeleton-line-price"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default YouMayLike;
