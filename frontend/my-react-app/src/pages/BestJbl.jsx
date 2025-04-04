import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './BestJbl.css';

const BestJblSpeakers = () => {
    const { filterProducts } = useShop();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = () => {
            const filteredProducts = filterProducts({
                brands: ["JBL"]
            });

            setProducts(filteredProducts);
        };

        getProducts();
    }, [filterProducts]);

    // Function to calculate discount percentage
    const calculateDiscount = (oldPrice, newPrice) => {
        const discount = ((oldPrice - newPrice) / oldPrice) * 100;
        return Math.round(discount);
    };

    return (
        <div className="best-jbl-products">
            <div className="header-section">
                <h1 className="title">JBL Speakers || Bring The Concert Home</h1>
                <Link to="/woofers/wireless-speakers/jbl" className="jbl-view-all">
                    View All <ArrowRight size={20} />
                </Link>
            </div>

            <div className="jbl-products-grid">
                {products.map(product => (
                    <div key={product._id} className="jbl-product-card">
                        <Link to={`/product/${product.name}-${product.id}`} className="image-link">
                            <img 
                                className="jbl-product-image"
                                src={product.image} 
                                alt={product.name} 
                            />
                            {product.old_price && product.new_price && (
                                <div className="jbl-discount-badge">
                                    -{calculateDiscount(product.old_price, product.new_price)}%
                                </div>
                            )}
                        </Link>
                        <div className="jbl-product-details">
                            <h2 className="jbl-product-name">{product.name}</h2>
                                <p className="jbl-price">Ksh {product.new_price}</p>
                                {product.old_price && (
                                    <p className="jbl-old-price">Ksh {product.old_price}</p>
                                )}
                            </div>
                        </div>
                ))}
            </div>
        </div>
    );
};

export default BestJblSpeakers;