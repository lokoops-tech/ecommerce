import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Loader 
} from 'lucide-react';
import './Navbar.css';

const categoryData = {
  "phone-accessories": ["cases-covers", "screen-protectors", "chargers-cables", "power-banks", "phone-stands", "camera-accessories"],
  "watch": ["smartwatches", "analog-watches", "digital-watches", "luxury-watches", "watch-bands", "watch-repair-kits"],
  "fridge": ["single-door", "double-door", "side-by-side", "mini-fridges", "wine-coolers", "freezers"],
  "pc-computer-products": ["laptops", "desktops", "monitors", "keyboards-mice", "storage-devices", "networking-equipment"],
  "tv-appliances": ["smart-tvs", "led-lcd-tvs", "tv-mounts", "streaming-devices", "remote-controls", "tv-accessories"],
  "woofers": ["subwoofers", "soundbars", "home-theater-systems", "car-woofers", "wireless-speakers", "amplifiers"],
  "kitchen-appliances": ["mixers-blenders", "microwave-ovens", "dishwashers", "food-processors", "coffee-makers", "electric-kettles"],
  "groomings": ["shavers-trimmers", "hair-dryers", "straighteners", "facial-care-devices", "body-groomers", "manicure-sets"],
  "earpods": ["wireless-earbuds", "gaming-headsets", "noise-canceling", "sports-earphones", "true-wireless", "earphone-accessories"],
  "electricals": ["switches-sockets", "wiring-cables", "circuit-breakers", "led-lighting", "fans-ventilation", "voltage-stabilizers"]
};

const CategoryDropdown = ({ category, isHovered, onMouseEnter, onMouseLeave, isMobile, handleBackToMain, handleSubCategoryClick }) => {
  // For desktop view (hover behavior)
  if (!isMobile && !isHovered) return null;
  
  return (
    <div 
      className={`nav-category-dropdown ${isMobile ? 'nav-mobile-dropdown' : ''}`}
      onMouseEnter={!isMobile ? onMouseEnter : undefined}
      onMouseLeave={!isMobile ? onMouseLeave : undefined}
    >
      {isMobile && (
        <div className="nav-mobile-back-button" onClick={handleBackToMain}>
          <ChevronLeft className="nav-icon" /> Back to Categories
        </div>
      )}
      {categoryData[category]?.map((subCategory, index) => (
        <Link 
          key={index}
          to={`/${category}/${subCategory}`}
          className="nav-dropdown-item"
          onClick={() => handleSubCategoryClick(category, subCategory)}
        >
          {subCategory.replace(/-/g, ' ')}
        </Link>
      ))}
    </div>
  );
};

const ProfileDropdown = ({ closeDropdown }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { setCartState, getDefaultCart } = useShop();

  const handleLogin = () => {
    navigate("/login");
    closeDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDropdown]);
  

  // Stop propagation to prevent interactions with category dropdowns
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="nav-profile-dropdown" 
      ref={dropdownRef}
      onClick={handleDropdownClick}
    >
      {localStorage.getItem('auth-token') ? (
        <>
          <div className="nav-dropdown-item">
            <Link to="/orders" onClick={closeDropdown} className="nav-dropdown-link">Orders</Link>
          </div>
          <div
            className="nav-dropdown-item"
            onClick={() => {
              localStorage.removeItem("auth-token");
              localStorage.removeItem("token-expiry");
              localStorage.removeItem("cart"); // Clear the cart data
              setCartState(getDefaultCart()); // Reset cart state
              navigate("/");
              closeDropdown();
            }}
          >
            Logout
          </div>
        </>
      ) : (
        <div className="nav-dropdown-item" onClick={handleLogin}>
          Login/Signup
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { cartState, getTotalCartItems } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Search functionality states (integrated from Search.jsx)
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if viewport is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 800);
      if (window.innerWidth > 800) {
        // Reset mobile navigation state when switching to desktop
        setActiveCategory(null);
      }
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset search term when not on search page (from Search.jsx)
  useEffect(() => {
    if (!location.pathname.startsWith('/search')) {
      setSearchTerm('');
    }
  }, [location.pathname]);

  const handleCategoryClick = (category, e) => {
    if (e) e.preventDefault(); // Prevent default link behavior
      
    if (category === "shop") {
      navigate("/");
      closeMenu();
    } else {
      setActiveCategory(category);
      setMenu(category);
      navigate(`/${category}`); // Navigate to the main category page
      
      // Only close menu on desktop if not hamburger style
      if (!isJumiaStyle) {
        closeMenu();
      }
    }
  };

  const handleSubCategoryClick = (category, subCategory) => {
    // Navigate to the subcategory page
    navigate(`/${category}/${subCategory}`);
    // Close the menu after navigating
    closeMenu();
    // Reset active category
    setActiveCategory(null);
  };

  const handleBackToMain = () => {
    setActiveCategory(null);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveCategory(null);
    setIsMenuOpen(!isMenuOpen);
  };

  // Search functions (from Search.jsx)
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSearchClick = () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);

    // Navigate to search results with the current search term
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`, {
      state: { searchTerm: searchTerm.trim() }
    });

    setTimeout(() => setIsLoading(false), 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // Navigate to home when logo is clicked
  const handleLogoClick = () => {
    navigate('/');
  };

  // Always use Jumia-style with hamburger menu on all screen sizes
  const isJumiaStyle = true;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth <= 500);
      if (window.innerWidth > 500) {
        setIsSearchExpanded(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  return (
    
    <div className="nav-container">
      <div className="nav-top">
        <div className="nav-left">
          <button 
            className="nav-hamburger-btn"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="nav-icon" /> : <Menu className="nav-icon" />}
          </button>
          
          <div className="nav-logo" onClick={handleLogoClick}>
            <h1>gich-<span></span></h1>
          </div>
        </div>
        
        {!isMobileView && (
          <div className="nav-search-container">
            <div className="nav-search-bar">
              <input
                className="nav-search-input"
                type="text"
                placeholder="Search ...."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="nav-search-btn" type="button" onClick={handleSearchClick}>
                {isLoading ? <Loader className="nav-icon nav-spinner" /> : <Search className="nav-icon" />}
              </button>
            </div>
          </div>
        )}

        {/* Mobile view elements */}
        {isMobileView && (
          <button className="nav-search-icon-btn" onClick={toggleSearch}>
            <Search size={22} className="nav-icon" />
          </button>
        )}
        
        <div className="nav-icons">
          {/* Expanded search container that shows below navbar on mobile */}
          {isMobileView && isSearchExpanded && (
            <div className="nav-expanded-search-wrapper">
              <div className="nav-search-container">
                <div className="nav-search-bar">
                  <input
                    className="nav-search-input"
                    type="text"
                    placeholder="Search by name, category, or ID..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <button className="nav-search-btn" type="button" onClick={handleSearchClick}>
                    {isLoading ? <Loader className="nav-icon nav-spinner" /> : <Search className="nav-icon" />}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="nav-profile-container">
            <button 
              className="nav-profile-btn"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              aria-label="Profile menu"
            >
              <User  size={(30)}
              className="nav-icon-user" />
            </button>
            {showProfileDropdown && (
              <ProfileDropdown closeDropdown={() => setShowProfileDropdown(false)} />
            )}
            <span className='user-text'>Account</span>
          </div>
          
          <Link to="/cart" aria-label="Shopping cart" className="nav-cart-icon-container">
            <ShoppingCart className="nav-icon-cart" 
            strokeWidth={2.6}
            height={30}
            size={30}
          
            
            />
            <span className="nav-cart-count">{getTotalCartItems()}</span>
             
          </Link>
          <p className='cart-text'>cart</p>
        </div>

      </div>
    
      <div className={`nav-links ${isMenuOpen ? "nav-open" : ""}`}>
        {activeCategory ? (
          // Showing subcategories for the active category
          <CategoryDropdown 
            category={activeCategory}
            isHovered={true}
            isMobile={true}
            handleBackToMain={handleBackToMain}
            handleSubCategoryClick={handleSubCategoryClick}
          />
        ) : (
          // Main category list view
          <ul className="nav-category-list">
            {[
              "shop",
              ...Object.keys(categoryData)
            ].map((item, index) => (
              <li 
                key={index} 
                onMouseEnter={() => !isJumiaStyle && setHoveredCategory(item)}
                onMouseLeave={() => !isJumiaStyle && setHoveredCategory(null)}
                className={`nav-item ${menu === item ? "nav-active" : ""}`}
              >
                <div className="nav-item-container">
                  <Link 
                    className="nav-category-link"
                    style={{ textDecoration: 'none', color: 'black' }} 
                    to={item === "shop" ? "/" : `/${item}`}
                    onClick={(e) => handleCategoryClick(item, e)}
                  >
                    {item.replace(/-/g, " ")}
                  </Link>
                  {item !== "shop" && (
                    <button 
                      className="nav-category-indicator"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveCategory(item);
                        setMenu(item);
                      }}
                    >
                      <ChevronRight className="nav-icon" />
                    </button>
                  )}
                </div>
                {menu === item && <hr className="nav-divider" />}
                
                {/* Desktop dropdown - only shown on hover if not in Jumia style */}
                {!isJumiaStyle && item !== "shop" && (
                  <CategoryDropdown 
                    category={item}
                    isHovered={hoveredCategory === item}
                    onMouseEnter={() => setHoveredCategory(item)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    isMobile={false}
                    handleSubCategoryClick={handleSubCategoryClick}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;