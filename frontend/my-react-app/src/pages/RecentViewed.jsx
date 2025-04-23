import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopContext } from '../context/ShopContext';
import SEO from './Seo.jsx';
import Item from '../components/item/Item';
import './RecentlyViewed.css';

const RecentlyViewedItems = ({ currentCategory, currentProductId }) => {
    const ITEMS_PER_PAGE = 5;
    const navigate = useNavigate();
    const { all, loading, error } = useContext(shopContext);
    const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
    const [recentItems, setRecentItems] = useState([]);

    useEffect(() => {
        console.log('All Products:', all);
        console.log('Current Category:', currentCategory);
        console.log('Current Product ID:', currentProductId);

        const filterRecentItems = () => {
            // More robust filtering logic
            const filteredItems = all.filter(product => {
                const categoryMatch = !currentCategory || product.category === currentCategory;
                const excludeCurrentProduct = product.id !== currentProductId;
                return categoryMatch && excludeCurrentProduct;
            });

            console.log('Filtered Items:', filteredItems);
            setRecentItems(filteredItems);
        };

        // Only filter if products are loaded
        if (all && all.length > 0) {
            filterRecentItems();
        }
    }, [all, currentCategory, currentProductId]);

    const handleLoadMore = () => {
        setVisibleItems(prevCount => prevCount + ITEMS_PER_PAGE);
    };

    const handleProductClick = (productName, productId) => {
        navigate(`/product/${productName}-${productId}`);
    };

    const displayedItems = useMemo(() => {
        const items = recentItems.slice(0, visibleItems);
        console.log('Displayed Items:', items);
        return items;
    }, [recentItems, visibleItems]);

    const hasMoreItems = visibleItems < recentItems.length;

    if (loading) {
        return (
            <div className="loading">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                    <div key={index} className="skeleton-item">Loading...</div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                Error: {error} <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    // Debug rendering condition
    console.log('Rendering Conditions:', {
        recentItemsLength: recentItems.length,
        displayedItemsLength: displayedItems.length,
        isLoading: loading
    });

    if (recentItems.length === 0) {
        return (
            <div className="no-recent-items">
                <p>No recently viewed items found.</p>
            </div>
        );
    }

    return (
        <>
            <SEO 
                defaultData={{
                    metatitle: 'Gich-tech Recently Viewed Items',
                    description: 'Products you have recently viewed',
                    keywords: 'recent, viewed, products'
                }}
            />
            
            <div className="recently-viewed-container">
                <div className="recently-viewed-header">
                    <h1>Recently Viewed</h1>
                </div>
                
                <div className="recently-viewed-grid">
                    {displayedItems.map((item) => {
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
                                    old_price={item.old_price}
                                    discountPercentage={discountPercentage}
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
        </>
    );
};

export default RecentlyViewedItems;
