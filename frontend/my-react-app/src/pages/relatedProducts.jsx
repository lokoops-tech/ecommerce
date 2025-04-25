import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './relatedProduct.css';
import Item from '../components/item/Item';

// Define the API endpoint as a constant
const API_ENDPOINT = 'https://ecommerce-axdj.onrender.com/product/allproducts';

const RelatedProduct = ({ currentCategory, currentProductId }) => {
    const ITEMS_PER_PAGE = 8;
    const navigate = useNavigate();
    const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (!currentCategory || !currentProductId) return;

        const fetchRelatedProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINT); // Use the defined constant
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                
                // Check if data is an array before filtering
                const products = Array.isArray(data) ? data : data.products || [];
                
                // Filter products by category and exclude current product
                const filtered = products.filter(product => 
                    product.category === currentCategory && 
                    product.id !== currentProductId
                );
                console.log('Filtered Related Products:', filtered);
                setRelatedProducts(filtered);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [currentCategory, currentProductId]);

    const handleLoadMore = () => {
        setVisibleItems(prevCount => prevCount + ITEMS_PER_PAGE);
    };

    const handleProductClick = (productName, productId) => {
        navigate(`/product/${productName}-${productId}`);
    };

    const displayedProducts = useMemo(() => {
        return relatedProducts.slice(0, visibleItems);
    }, [relatedProducts, visibleItems]);

    const hasMoreItems = visibleItems < relatedProducts.length;

    if (loading) return (
        <div className="loading">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <div key={index} className="skeleton-item"></div>
            ))}
        </div>
    );

    if (error) return (
        <div className="error">
            Error: {error}. <button onClick={() => window.location.reload()}>Retry</button>
        </div>
    );

    return (
        <div className="related">
            <div className="related-header">
            <h1>Related Products</h1>
            </div>
            <div className="relatedproducts">
                {displayedProducts.map((item) => {
                    // Calculate discount percentage
                    const discountPercentage = item.old_price
                        ? Math.round(((item.old_price - item.new_price) / item.old_price) * 100)
                        : 0;

                    return (
                        <div 
                            key={item.id} 
                            onClick={() => handleProductClick(item.name, item.id)}
                            className="product-item-wrapper"
                        >
                            <Item
                                id={item.id}
                                name={item.name}
                                image={item.image}
                                category={item.category}
                                new_price={item.new_price}
                                old_price={item.old_price} // Pass old_price
                                discountPercentage={discountPercentage} // Pass discount percentage
                            />
                        </div>
                    );
                })}
            </div>
            {hasMoreItems && (
                <div className="load-more-container">
                    <button className="load-more-button" onClick={handleLoadMore}>
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default RelatedProduct;
