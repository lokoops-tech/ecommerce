import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { shopContext } from '../context/ShopContext';
import { Grid, List, Search, Sliders, Loader } from 'lucide-react';
import './SearchResults.css';

const SearchResultsPage = () => {
  const { all } = useContext(shopContext);
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const allProducts = Array.isArray(all) ? all : [];
  const categories = [...new Set(allProducts.map(product => product.category))];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const term = queryParams.get('q');
    setSearchTerm(term || '');

    if (term) {
      setIsLoading(true);
      setError('');

      // Added 4 second delay for loading state
      const loadingTimer = setTimeout(() => {
        try {
          // Make sure 'all' is an array before filtering
          const productsToFilter = Array.isArray(all) ? all : [];
          
          let filteredResults = productsToFilter.filter(product => {
            const searchValue = term.toLowerCase();
            return (
              product.id.toString().includes(searchValue) ||
              product.name.toLowerCase().includes(searchValue) ||
              product.category.toLowerCase().includes(searchValue)
            );
          });

          if (selectedCategories.length > 0) {
            filteredResults = filteredResults.filter(product =>
              selectedCategories.includes(product.category)
            );
          }

          filteredResults = filteredResults.filter(
            product => 
              product.new_price >= priceRange.min && 
              product.new_price <= priceRange.max
          );

          switch (sortBy) {
            case 'price-low':
              filteredResults.sort((a, b) => a.new_price - b.new_price);
              break;
            case 'price-high':
              filteredResults.sort((a, b) => b.new_price - a.new_price);
              break;
            case 'name':
              filteredResults.sort((a, b) => a.name.localeCompare(b.name));
              break;
            default:
              break;
          }

          if (filteredResults.length === 0) {
            setError('No products found. Try different search terms or filters.');
          }

          setSearchResults(filteredResults);
        } catch (err) {
          console.error("Error processing search results:", err);
          setError('An error occurred while searching. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }, 4000); // Changed delay to 4000ms (4 seconds)

      // Cleanup timer on component unmount or when dependencies change
      return () => clearTimeout(loadingTimer);
    }
  }, [location.search, all, sortBy, priceRange, selectedCategories]);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) {
        setFiltersOpen(true);
      } else {
        setFiltersOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateDiscount = (oldPrice, newPrice) => {
    if (!oldPrice || !newPrice) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  };

  return (
    <div className="search-results-container">
      <div className="search-header">
        <div>
          <h2 className="search-title">
            Search results for <span className="search-term">"{searchTerm}"</span>
            {!isLoading && !error && (
              <div className="search-count">
                {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} found
              </div>
            )}
          </h2>
        </div>
        <div className="view-controls">
          <div className="view-buttons">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
            >
              <Grid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            >
              <List />
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      {window.innerWidth <= 800 && (
  <button 
    className="filter-toggle" 
    onClick={() => setFiltersOpen(prev => !prev)}
  >
    <Sliders className="icon" /> 
    {filtersOpen ? 'Hide Filters' : 'Show Filters'}
  </button>
)}
      <div className="search-layout">
      <div className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
          <div className="filters-panel">
            <h3 className="filters-title">
              <Sliders className="icon" /> Filters
            </h3>
            <div className="price-range">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  className="price-input"
                  onChange={(e) => setPriceRange(prev => ({
                    ...prev,
                    min: Number(e.target.value) || 0
                  }))}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="price-input"
                  onChange={(e) => setPriceRange(prev => ({
                    ...prev,
                    max: Number(e.target.value) || Infinity
                  }))}
                />
              </div>
            </div>
            <div className="categories-list">
              <h4>Categories</h4>
              {categories.map(category => (
                <label key={category} className="category-item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories(prev => [...prev, category]);
                      } else {
                        setSelectedCategories(prev => 
                          prev.filter(cat => cat !== category)
                        );
                      }
                    }}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
        </div>

      <div className="results-container">
        {isLoading ? (
          <div className="search-loading-container">
            <div className="search-loading-wrapper">
              <Loader className="search-loading-icon" />
              <span className="search-loading-text">Loading results...</span>
            </div>
          </div>
        ) : error ? (
          <div className="error-message">
            {error}
          </div>
          ) : (
          
            <div className={`results-grid ${viewMode}-view`}>
              {searchResults.map((product) => {
                const discount = calculateDiscount(product.old_price, product.new_price);
                return (
                <div className="product-card" key={product.id}>
                  <Link to={`/product/${product.name}-${product.id}`}>
                    <div className="product-image-container">
                      {discount > 0 && (
                        <div className="discount-badge">
                          -{discount}%
                        </div>
                      )}
                      <img
                        className="product-image"
                        src={product.image || "/api/placeholder/400/300"}
                        alt={product.name}
                      />
                    </div>
                  </Link>
                  <div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-price">
                      <span className="current-price">
                        KSH {product.new_price}
                      </span>
                      {product.old_price && (
                        <span className="old-price">
                          KSH {product.old_price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;