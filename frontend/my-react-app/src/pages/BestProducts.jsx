import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './BestProducts.css';

const BestProducts = () => {
    const params = useParams();
    const { filterProducts, all } = useShop();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [mainCategory, setMainCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [brand, setBrand] = useState('');

    useEffect(() => {
        if (!all.length) {
            setLoading(false);
            return;
        }

        const pathParts = window.location.pathname.split('/').filter(part => part);
        setMainCategory(pathParts[0] || '');
        setSubCategory(pathParts[1] || '');
        setBrand(pathParts[2] || '');

        console.log('URL Parameters:', { 
            mainCategory: pathParts[0], 
            subCategory: pathParts[1], 
            brand: pathParts[2] 
        });

        const loadProducts = () => {
            setLoading(true);
            try {
                const filteredProducts = filterProducts({
                    category: pathParts[0],
                    subcategory: pathParts[1],
                    brands: [pathParts[2]]
                });

                console.log('Filtered products:', filteredProducts);

                const limitedProducts = showAll 
                    ? filteredProducts 
                    : filteredProducts.slice(0, 4);

                setProducts(limitedProducts);
            } catch (error) {
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [params, showAll, filterProducts, all]);

    const formatTitle = (text) => {
        if (!text) return '';
        return text
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="best-products">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link to="/">Home</Link> &gt; 
                {mainCategory && <Link to={`/${mainCategory}`}> {formatTitle(mainCategory)}</Link>} &gt; 
                {subCategory && <Link to={`/${mainCategory}/${subCategory}`}> {formatTitle(subCategory)}</Link>} &gt; 
                {brand && <span> {formatTitle(brand)}</span>}
            </nav>
            
            {loading ? (
                <div className="loading">Loading products...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : products.length === 0 ? (
                <div className="no-products">
                    <h1>No {formatTitle(brand)} {formatTitle(subCategory)} found in {formatTitle(mainCategory)}</h1>
                    <p>Try checking a different category or brand.</p>
                </div>
            ) : (
                <>
                    <h1>Best {formatTitle(brand)} {formatTitle(subCategory)}</h1>
                    <div className="best-grid">
                        {products.map(product => {
                            const discount = product.old_price
                                ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100)
                                : 0;

                            return (
                                <div key={product.id} className="best-card">
                                    {discount > 0 && <div className="product-discount">-{discount}%</div>}
                                    
                                    <Link 
                                        to={`/product/${product.id}/${encodeURIComponent(product.name)}`} 
                                        className="product-link"
                                    >
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="product-image"
                                        />
                                    </Link>
                                    
                                    <div className="best-detail">
                                        <h2>{product.name}</h2>
                                        <div className="product-price">
                                            <span className="current-price">Ksh {product.new_price?.toLocaleString() || '0'}</span>
                                            {product.old_price && (
                                                <span className="original-price">Ksh {product.old_price?.toLocaleString() || '0'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {!showAll && products.length > 4 && (
                        <button 
                            className="view-all"
                            onClick={() => setShowAll(true)}
                        >
                            View All {formatTitle(brand)} {formatTitle(subCategory)}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default BestProducts;