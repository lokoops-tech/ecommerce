import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './BeiYangu.css';
const API_BASE_URL = "http://localhost:4000";

const BeiYangu = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/product/allproducts`);
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                
                // Check if data is an array before filtering
                if (Array.isArray(data)) {
                    const filteredProducts = data.filter(product => product.new_price < 5000);
                    setProducts(filteredProducts);
                } else if (data.products && Array.isArray(data.products)) {
                    // If data is an object with a products array
                    const filteredProducts = data.products.filter(product => product.new_price < 5000);
                    setProducts(filteredProducts);
                } else {
                    // Handle unexpected data structure
                    throw new Error('Unexpected data format from API');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const LoadingSkeleton = () => (
        <div className="budget-product-grid">
            {[1, 2, 3, 4].map((index) => (
                <div key={index} className="budget-product-skeleton">
                    <div className="budget-skeleton-image animate-pulse"></div>
                    <div className="budget-skeleton-content">
                        <div className="budget-skeleton-title animate-pulse"></div>
                        <div className="budget-skeleton-price animate-pulse"></div>
                        <div className="budget-skeleton-category animate-pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="budget-deals-wrapper">
            <Helmet>
                <title>Budget Deals Under Ksh 5000 | Gich-Tech</title>
                <meta name="description" content="Discover premium tech products under Ksh 5000. Quality meets unbeatable prices at Gich-Tech." />
                <meta name="keywords" content="budget tech, affordable electronics, tech deals, Gich-Tech, under 5000" />
                <meta property="og:title" content="Budget Deals Under Ksh 5000 | Gich-Tech" />
                <meta property="og:description" content="Smart shopping, smarter savings! Affordable tech finds under Ksh 5000." />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://gich-tech.com/budget-deals" />
            </Helmet>
            
            <div className="budget-deals-header">
                <h1 className="budget-deals-title">Unlock Premium Deals Under Ksh 5000!</h1>
                <h2 className="budget-deals-subtitle">Smart Shopping, Smarter Savings!</h2>
            </div>
            
            <div className="budget-deals-banner">
                <div className="budget-banner-content">
                    <p className="budget-banner-text">Affordable finds under Ksh 5000—Only at Gich-Tech! Quality meets unbeatable prices.</p>
                </div>
            </div>
            
            <div className="budget-products-container">
                {error && <p className="budget-error-message">Error: {error}</p>}
                
                {loading ? (
                    <LoadingSkeleton />
                ) : (
                    <>
                        {products.length === 0 ? (
                            <p className="budget-empty-message">No products under Ksh 5000 available at the moment.</p>
                        ) : (
                            <div className="budget-products-grid">
                                {products.map((item) => {
                                    const discount = item.old_price
                                        ? Math.round(((item.old_price - item.new_price) / item.old_price) * 100)
                                        : 0;

                                    return (
                                        <div key={item.id || item._id} className="budget-product-card">
                                            {discount > 0 && (
                                                <div className="budget-discount-tag">-{discount}%</div>
                                            )}
                                            <Link to={`/product/${item.id || item._id}/${encodeURIComponent(item.name)}`} className="budget-product-link">
                                                <img
                                                    src={item.image || "/api/placeholder/400/300"}
                                                    alt={item.name}
                                                    className="budget-product-image"
                                                    loading="lazy"
                                                />
                                            </Link>
                                            <div className="budget-product-details">
                                                <h3 className="budget-product-name">{item.name}</h3>
                                                <div className="budget-price-container">
                                                    <span className="budget-current-price">
                                                        Ksh {item.new_price.toLocaleString()}
                                                    </span>
                                                    {item.old_price && (
                                                        <span className="budget-original-price">
                                                            Ksh {item.old_price.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BeiYangu;