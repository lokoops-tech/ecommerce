import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './BestOrimopowerBanks.css';

const BestPowerbanks = () => {
    const { filterProducts } = useShop();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = () => {
            const filteredProducts = filterProducts({
                category: 'phone-accessories',
                subcategory: 'power-banks',
                brands: ['orimo']
            });

            setProducts(filteredProducts.slice(0, 4));
        };

        loadProducts();
    }, [filterProducts]);

    // Function to calculate discount percentage
    const calculateDiscount = (oldPrice, newPrice) => {
        const discount = ((oldPrice - newPrice) / oldPrice) * 100;
        return Math.round(discount);
    };

    return (
        <div className="powerbank-best-products">
            <div className="powerbank-header-container">
                <h1 className="powerbank-title"> Orimo Powerbanks || Top Deals</h1>
                <Link to="/phone-accessories/power-banks/orimo" className="powerbank-view-all">
                    View All <ArrowRight size={20} />
                </Link>
            </div>

            <div className="powerbank-products-grid">
                {products.map(product => (
                    <div key={product._id} className="powerbank-product-card">
                        <Link to={`/product/${product.name}-${product.id}`} className="powerbank-image-link">
                            <img 
                                className="powerbank-product-image"
                                src={product.image} 
                                alt={product.name} 
                            />
                            {product.old_price && product.new_price && (
                                <div className="powerbank-discount-badge">
                                    -{calculateDiscount(product.old_price, product.new_price)}%
                                </div>
                            )}
                        </Link>
                        <div className="powerbank-product-details">
                            <h2 className="powerbank-product-name">{product.name}</h2>
                         
                                <h3 className="powerbank-price">Ksh {product.new_price}</h3>
                                {product.old_price && (
                                    <h3 className="powerbank-old-price">Ksh {product.old_price}</h3>
                                )}
        
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BestPowerbanks;
