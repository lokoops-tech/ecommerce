import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './BestVitron.css';

const BestVitronTvs = () => {
    const { filterProducts } = useShop();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = () => {
            const filteredProducts = filterProducts({
                category: 'tv-appliances',
                subcategory: 'smart-tvs',
                brands: ['vitron']
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
        <div className="vitron-best-products">
            <div className="vitron-header-container">
                <h1 className="vitron-title-head"> Vitron Special Deals || Stunning Visuals</h1>
                <Link to="/tv-appliances/smart-tvs/vitron" className="vitron-view-all">
                    View All <ArrowRight size={20} />
                </Link>
            </div>
            <div className="vitron-subtitle">
               <p></p>
               </div>

            <div className="vitron-products-grid">
                {products.map(product => (
                    <div key={product.id} className="vitron-product-card">
                        <Link to={`/product/${product.name}-${product.id}`} className="vitron-image-link">
                            <img 
                                className="vitron-product-image"
                                src={product.image} 
                                alt={product.name} 
                            />
                            {product.old_price && product.new_price && (
                                <div className="vitron-discount-badge">
                                    -{calculateDiscount(product.old_price, product.new_price)}%
                                </div>
                            )}
                        </Link>
                        <div className="vitron-product-details">
                            <h2 className="vitron-product-name">{product.name}</h2>
                    
                                <p className="vitron-price">Ksh {product.new_price}</p>
                                {product.old_price && (
                                    <p className="vitron-old-price">Ksh {product.old_price}</p>
                                )}
                            </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BestVitronTvs;