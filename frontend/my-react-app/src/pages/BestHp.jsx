import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './BestHp.css';

const BestHpLaptops = () => {
    const { filterProducts } = useShop();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = () => {
            const filteredProducts = filterProducts({
                brands: ["HP"]
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
        <div className="hp-best-products">
            <div className="hp-header-container">
                <h1 className="hp-title">HP Laptops  || Performance You Can Trust </h1>
                <Link to="/pc-computer-products/laptops/hp" className="hp-view-all">
                    View All <ArrowRight size={20} />
                </Link>
            </div>

            <div className="hp-products-grid">
                {products.map(product => (
                    <div key={product.id} className="hp-product-card">
                        <Link to={`/product/${product.name}-${product.id}`} className="hp-image-link">
                            <img 
                                className="hp-product-image"
                                src={product.image} 
                                alt={product.name} 
                            />
                            {product.old_price && product.new_price && (
                                <div className="hp-discount-badge">
                                    -{calculateDiscount(product.old_price, product.new_price)}%
                                </div>
                            )}
                        </Link>
                        <div className="hp-product-details">
                               <h3 className="hp-product-name">{product.name}</h3>
                                <p className='hp-price-new'>Ksh {product.new_price}</p>
                                <p className="hp-old-price">Ksh {product.old_price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BestHpLaptops;