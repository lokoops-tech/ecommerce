import React, { useState, useContext, useEffect } from "react";
import { ArrowUpDown, ArrowDownUp, SortAsc } from "lucide-react";
import { shopContext } from "../context/ShopContext";
import Item from "../components/item/Item.jsx";
import { Link } from "react-router-dom";
import watch from '../Assets/watch.png';
import phone from '../Assets/ph.png';
import fridge from '../Assets/fridge.png';
import electric from '../Assets/electricals.png';
import laptops from '../Assets/laptops.png';
import speaker from '../Assets/speaker.png';
import kitchen from '../Assets/kitchen-appliances.png';
import groom from '../Assets/grooming.png';
import tv from '../Assets/tv0.png';
import ear from '../Assets/earpods.png';
import '../pages/css/Shop_category.css';
import SEO from "./Seo.jsx";
import { categoryBrands } from "../../Seo.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShopCategory = ({ category, subcategory }) => {
    const { 
        allProducts, 
        filteredProducts, 
        filterByCategory, 
        filterBySubcategory, 
        addToCart, 
        isAuthenticated 
    } = useContext(shopContext);

    const [sortOption, setSortOption] = useState("default");
    const [visibleCount, setVisibleCount] = useState(12);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [displayProducts, setDisplayProducts] = useState([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [hoveredProductId, setHoveredProductId] = useState(null); // Track hovered product

    const categoryBanners = {
        "phone-accessories": phone,
        "pc-computer-products": laptops,
        "fridge": fridge,
        "tv-appliances": tv,
        "woofers": speaker,
        "kitchen-appliances": kitchen,
        "watch": watch,
        "groomings": groom,
        "earpods": ear,
        "electricals": electric
    };

    // Handle Add to Cart
    const handleAddToCart = async (productId) => {
        try {
            if (!isAuthenticated) {
                toast.warning("Please log in to add items to your cart");
                return;
            }

            await addToCart(productId, 1);
            toast.success("Added to cart successfully");
        } catch (error) {
            toast.error(error.message);
        }
    };


    // Get display names for the current category
    const getAvailableBrands = () => {
        return categoryBrands[category] 
            ? Object.keys(categoryBrands[category])
            : [];
    };

    // Convert backend brand name to display name
    const getDisplayBrand = (backendBrand) => {
        if (!backendBrand || !categoryBrands[category]) return backendBrand || '';
        
        const displayBrand = Object.entries(categoryBrands[category])
            .find(([display, lower]) => lower === backendBrand.toLowerCase());
        
        return displayBrand ? displayBrand[0] : (backendBrand || '');
    };

    // Convert display brand to backend brand
    const getBackendBrand = (displayBrand) => {
        if (!displayBrand) return '';
        return categoryBrands[category]?.[displayBrand]?.toLowerCase() || displayBrand.toLowerCase();
    };

    // Initial category/subcategory filter
    useEffect(() => {
        if (subcategory) {
            filterBySubcategory(subcategory);
        } else {
            filterByCategory(category);
        }
        setSelectedBrands([]);
    }, [category, subcategory, filterByCategory, filterBySubcategory]);

    // Handle filtering and display products
    useEffect(() => {
        let productsToFilter = [...filteredProducts];

        if (selectedBrands.length > 0) {
            productsToFilter = productsToFilter.filter(product => 
                selectedBrands.some(displayBrand => {
                    return product.brand && 
                           getBackendBrand(displayBrand) === product.brand.toLowerCase();
                })
            );
        }

        productsToFilter = productsToFilter.filter(product => {
            const productPrice = product.new_price || 0;
            return productPrice >= priceRange.min && productPrice <= priceRange.max;
        });

        setDisplayProducts(productsToFilter);
    }, [selectedBrands, priceRange, filteredProducts]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleFilter = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    const handleSortChange = (option) => {
        setSortOption(option);
        setVisibleCount(12);
    };

    const handleBrandChange = (displayBrand) => {
        setSelectedBrands(prev => 
            prev.includes(displayBrand)
                ? prev.filter(b => b !== displayBrand)
                : [...prev, displayBrand]
        );
    };

    const handlePriceChange = (e) => {
        const value = Number(e.target.value);
        setPriceRange(prev => ({
            ...prev,
            [e.target.name]: value >= 0 ? value : 0
        }));
    };

    // Sort products
    const sortedProducts = [...displayProducts].sort((a, b) => {
        switch(sortOption) {
            case "priceLowToHigh":
                return (a.new_price || 0) - (b.new_price || 0);
            case "priceHighToLow":
                return (b.new_price || 0) - (a.new_price || 0);
            case "alphabetical":
                return (a.name || '').localeCompare(b.name || '');
            default:
                return 0;
        }
    });

    // Prepare category data for SEO
    const categoryData = {
        name: category.replace(/-/g, ' '),
        slug: category,
        subcategories: getAvailableBrands(),
        image: categoryBanners[category] || 'https://yourstore.com/default-category-image.jpg'
    };

    return (
        <div className="shop-container">
            {/* Add the SEO component */}
            <Seo category={categoryData} />

            {categoryBanners[category] && (
                <div className="category-banner">
                    <img 
                        src={categoryBanners[category]} 
                        alt={`${category} banner`} 
                        className="banner-image"
                    />
                </div>
            )}

            <div className="breadcrumbs">
                <Link to="/">Home</Link>
                <span> / </span>
                <Link to={`/${category}`}>{category.replace(/-/g, ' ')}</Link>
                {subcategory && (
                    <>
                        <span> / </span>
                        <span>{subcategory.replace(/-/g, ' ')}</span>
                    </>
                )}
            </div>

            <div className="shop-content">
                {windowWidth < 800 && (
                    <button className="filter-toggle" onClick={toggleFilter}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="21" x2="4" y2="14"></line>
                            <line x1="4" y1="10" x2="4" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12" y2="3"></line>
                            <line x1="20" y1="21" x2="20" y2="16"></line>
                            <line x1="20" y1="12" x2="20" y2="3"></line>
                            <line x1="1" y1="14" x2="7" y2="14"></line>
                            <line x1="9" y1="8" x2="15" y2="8"></line>
                            <line x1="17" y1="16" x2="23" y2="16"></line>
                        </svg>
                    </button>
                )}

                {(windowWidth >= 800 || isFilterVisible) && (
                    <aside className="filters-sidebar">
                        <div className="filter-section">
                            <h4>Brands ({getAvailableBrands().length})</h4>
                            <div className="brand-list">
                                {getAvailableBrands().map(displayBrand => (
                                    <label key={displayBrand} className="brand-checkbox">
                                        <input
                                            type="checkbox"
                                            value={displayBrand}
                                            checked={selectedBrands.includes(displayBrand)}
                                            onChange={() => handleBrandChange(displayBrand)}
                                        />
                                        <span>{displayBrand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="sort-bar">
                            <div className="sort-controls">
                                <span>Sort by:</span>
                                <div className="sort-buttons">
                                    <button 
                                        className={`sort-button ${sortOption === "priceLowToHigh" ? "active" : ""}`}
                                        onClick={() => handleSortChange("priceLowToHigh")}
                                    >
                                        <ArrowUpDown />
                                        <span>Price</span>
                                    </button>
                                    <button 
                                        className={`sort-button ${sortOption === "priceHighToLow" ? "active" : ""}`}
                                        onClick={() => handleSortChange("priceHighToLow")}
                                    >
                                        <ArrowDownUp />
                                        <span>Price</span>
                                    </button>
                                    <button 
                                        className={`sort-button ${sortOption === "alphabetical" ? "active" : ""}`}
                                        onClick={() => handleSortChange("alphabetical")}
                                    >
                                        <SortAsc />
                                        <span>A-Z</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="filter-section">
                            <h4>Price Range</h4>
                            <div className="price-inputs">
                                <input 
                                    type="number" 
                                    name="min" 
                                    value={priceRange.min} 
                                    onChange={handlePriceChange} 
                                    placeholder="Min"
                                    min="0"
                                />
                                <input 
                                    type="number" 
                                    name="max" 
                                    value={priceRange.max} 
                                    onChange={handlePriceChange} 
                                    placeholder="Max"
                                    min="0"
                                />
                            </div>
                        </div>
                    </aside>
                )}

                <main className="products-area">
                    <p className="showing-products">
                        {displayProducts.length > 0 ? (
                            <span>
                                Showing 1-{Math.min(visibleCount, displayProducts.length)} out of {displayProducts.length} products
                            </span>
                        ) : (
                            <span>No products found matching the selected filters</span>
                        )}
                    </p>

                    <div className="products-view">
                        {displayProducts.length > 0 ? (
                            sortedProducts.slice(0, visibleCount).map((item) => (
                                <div 
                                    key={item.id} 
                                    className="product-item"
                                    onMouseEnter={() => setHoveredProductId(item.id)}
                                    onMouseLeave={() => setHoveredProductId(null)}
                                >
                                    <Item {...item} />
                                    {hoveredProductId === item.id && (
                                        <button 
                                            className="add-to-cart-hover"
                                            onClick={() => handleAddToCart(item.id)}
                                        >
                                            Add to Cart
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-products">
                                No products found matching the selected filters. 
                                Try adjusting your brand or price selections.
                            </div>
                        )}
                    </div>

                    {visibleCount < displayProducts.length && (
                        <button 
                            className="load-more" 
                            onClick={() => setVisibleCount(prev => prev + 12)}
                        >
                            Load More
                        </button>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ShopCategory;
