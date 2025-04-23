import React, { useState, useContext, useEffect } from 'react';
import { shopContext } from '../../context/ShopContext';
import star_icon from '../../Assets/star_icon.png';
import star_dull_icon from '../../Assets/star_dull_icon.png';
import { FaWhatsapp, FaTruck, FaShieldAlt, FaClock, FaBox, FaExclamationTriangle, FaLock, FaInfoCircle, FaUndo,  } from 'react-icons/fa';
import { Share2, Facebook, Twitter, Linkedin, Copy } from 'lucide-react';
import RelatedProduct from '../../pages/relatedProducts';
import RecentlyViewedItems from '../../pages/RecentViewed';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SEO from '../../pages/Seo';
import './ProductDisplay.css';

const ProductDisplay = ({ product, sizes = [], keyFeatures = [] }) => {
    const { 
        cartState,
        addToCart, 
        updateCartItemQuantity,
        error,
        isAuthenticated,
    } = useContext(shopContext);
    <SEO product={product} />

    const [selectedImage, setSelectedImage] = useState(product?.image);
    const [addedToCart, setAddedToCart] = useState(false);
    const [is3DView, setIs3DView] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('description');
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [currentProductId, setCurrentProductId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showShareOptions, setShowShareOptions] = useState(false);

    const absoluteSavings = product.old_price - product.new_price;
    const percentageSavings = Math.round((absoluteSavings / product.old_price) * 100);
    const currentQuantity = product?.id && cartState?.items?.[product.id]?.quantity ? cartState.items[product.id].quantity : 0;
    const isInStock = product.stockStatus === 'IN_STOCK';

    const baseUrl = window.location.origin;
    const productImg = `${product.image}`;
    const productUrl = `${baseUrl}/product/${product.name}${product?.id}`;
    
    useEffect(() => {
      setErrorMessage('');
    }, [product]);

    useEffect(() => {
      if (product) {
        setSelectedImage(product.images?.main || product.image);
        setActiveCategory(product.category);
        setCurrentProductId(product.id);
      }
    }, [product]);

    const MetaTags = () => {
      useEffect(() => {
        const absoluteProductImg = product.image.startsWith('http')
          ? product.image
          : `${window.location.origin}${product.image.startsWith('/') ? '' : '/'}${product.image}`;

        const metaTags = [
          { property: 'og:title', content: product?.name || 'Product' },
          { property: 'og:description', content: `${product?.name} - Now at Ksh ${product?.new_price} (Save ${percentageSavings}%)` },
          { property: 'og:image', content: absoluteProductImg },
          { property: 'og:image:width', content: '1200' },
          { property: 'og:image:height', content: '630' },
          { property: 'og:url', content: productUrl },
          { property: 'og:type', content: 'product' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: product?.name || 'Product' },
          { name: 'twitter:description', content: `Now at Ksh ${product?.new_price} (Save ${percentageSavings}%)` },
          { name: 'twitter:image', content: absoluteProductImg },
        ];

        metaTags.forEach(tag => {
          const meta = document.createElement('meta');
          Object.keys(tag).forEach(key => {
            meta.setAttribute(key, tag[key]);
          });
          document.head.appendChild(meta);
        });

        return () => {
          metaTags.forEach(tag => {
            const selector = Object.keys(tag)
              .map(key => `meta[${key}="${tag[key]}"]`)
              .join(', ');
            const element = document.querySelector(selector);
            if (element) document.head.removeChild(element);
          });
        };
      }, [product, productUrl, percentageSavings]);

      return null;
    };

    const shippingInfo = {
      delivery: "Fast & Reliable Delivery within 24-48 hours",
      security: "100% Secure Payment Gateway",
      tracking: "Real-time Order Tracking",
      warranty: "1 Year Warranty on all Products"
    };

    const tabs = [
      { id: 'description', label: 'Description' },
      { id: 'shipping', label: 'Shipping & Delivery' },
      { id: 'reviews', label: 'Reviews' }
    ];

    const shareLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&picture=${encodeURIComponent(productImg)}&quote=${encodeURIComponent(`Check out ${product?.name} - Now at Ksh ${product?.new_price}!`)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`${product?.name} - Now at Ksh ${product?.new_price}!`)}&image=${encodeURIComponent(productImg)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}&title=${encodeURIComponent(`${product?.name} - Special Offer`)}&summary=${encodeURIComponent(`Now available at Ksh ${product?.new_price}. Save ${percentageSavings}%!`)}&source=${encodeURIComponent(productImg)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${product?.name} at Ksh ${product?.new_price} (${percentageSavings}% OFF): ${productUrl}`)}`
    };

    const copyToClipboard = () => {
      const shareText = `${product?.name} | Ksh ${product?.new_price} (Save ${percentageSavings}%) | ${productUrl}`;
      
      try {
        const richContent = `
          <div>
            <img src="${productImg}" alt="${product?.name}" style="max-width: 300px; height: auto;"/>
            <p><strong>${product?.name}</strong></p>
            <p>Ksh ${product?.new_price} (Save ${percentageSavings}%)</p>
            <p><a href="${productUrl}">${productUrl}</a></p>
          </div>
        `;
        
        const tempElement = document.createElement('div');
        tempElement.innerHTML = richContent;
        document.body.appendChild(tempElement);
        
        const range = document.createRange();
        range.selectNode(tempElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        
        const success = document.execCommand('copy');
        window.getSelection().removeAllRanges();
        document.body.removeChild(tempElement);
        
        if (success) {
          toast.success("Product details copied to clipboard!");
          return;
        }
      } catch (e) {
        console.log("Rich copy not supported, falling back to text");
      }
      
      navigator.clipboard.writeText(shareText)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
    };

    const shareOnWhatsApp = () => {
      const whatsappText = `Check out this product!
      
*${product?.name}*
Price: *Ksh ${product?.new_price}* (Save ${percentageSavings}%)

View it here: ${productUrl}`;

      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`, '_blank');
    };

    const handleShare = (platform) => {
      if (platform === 'copy') {
        copyToClipboard();
        setShowShareOptions(false);
        return;
      }
      
      if (platform === 'whatsapp') {
        shareOnWhatsApp();
        setShowShareOptions(false);
        return;
      }
      
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
      setShowShareOptions(false);
    };

    const toggleShareOptions = () => {
      setShowShareOptions(!showShareOptions);
    };

    const handleAddToCart = async () => {
      try {
        setErrorMessage('');

        if (isAuthenticated === false) {
          setErrorMessage('authentication');
          toast.warning("Please log in to add items to your cart");
          return;
        }

        if (!isInStock) {
          setErrorMessage('stock');
          toast.error("Sorry, this product is currently out of stock");
          return;
        }

        if (sizes.length > 0 && !selectedSize) {
          setErrorMessage('size');
          toast.error("Please select a size before adding to cart");
          return;
        }

        await addToCart(product.id, 1);
        setAddedToCart(true);
        toast.success("Added to cart successfully");
        setTimeout(() => setAddedToCart(false), 2000);
      } catch (error) {
        setErrorMessage('general');
        toast.error(error.message);
        setAddedToCart(false);
      }
    };

    const handleQuantityChange = async (change) => {
      const newQuantity = currentQuantity + change;
      if (newQuantity >= 0 && newQuantity <= 10000) {
        try {
          await updateCartItemQuantity(product.id, newQuantity);
        } catch (error) {
          toast.error(error.message);
        }
      }
    };

    const handleImageClick = (img) => {
      setSelectedImage(img);
      setIs3DView(false);
    };

    const toggle3DView = () => {
      setIs3DView(!is3DView);
    };

    const handleRatingSubmit = (e) => {
      e.preventDefault();
      try {
        if (userRating === 0) {
          toast.error("Please select a rating");
          return;
        }
        if (!reviewText.trim()) {
          toast.error("Please write a review");
          return;
        }
        if (reviewText.trim().length < 3) {
          toast.error("Review must be at least 3 characters long");
          return;
        }

        const newReview = {
          rating: userRating,
          comment: reviewText.trim(),
          name: reviewerName.trim() || 'Anonymous',
          date: new Date().toLocaleDateString(),
          id: Date.now(),
        };

        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        localStorage.setItem(`reviews-${product.id}`, JSON.stringify(updatedReviews));

        setUserRating(0);
        setReviewText('');
        setReviewerName('');
        toast.success("Review submitted successfully");
      } catch (error) {
        toast.error("Failed to submit review");
      }
    };

    useEffect(() => {
      if (product?.id) {
        const storedReviews = localStorage.getItem(`reviews-${product.id}`);
        if (storedReviews) {
          setReviews(JSON.parse(storedReviews));
        }
      }
    }, [product?.id]);

    const renderStars = (rating, totalStars = 5, interactive = false) => {
      return Array(totalStars).fill(0).map((_, index) => (
        <img 
          key={index}
          src={index < (interactive ? hoverRating || userRating : rating) ? star_icon : star_dull_icon}
          alt={index < rating ? "star" : "dull star"}
          onClick={interactive ? () => setUserRating(index + 1) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(index + 1) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          className={`star ${interactive ? 'interactive' : ''}`}
        />
      ));
    };

    const whatsappLink = `https://api.whatsapp.com/send?phone=YOUR_PHONE_NUMBER&text=Hello,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20on%20your%20website.`; 

    const renderErrorMessage = () => {
      if (!errorMessage) return null;

      switch (errorMessage) {
        case 'authentication':
          return (
            <div className="auth-error">
              <FaLock />
              <div>
                <p><strong>Login Required</strong></p>
                <p>Please log in to add items to your cart</p>
              </div>
            </div>
          );
        case 'stock':
          return (
            <div className="out-of-stock-error">
              <FaExclamationTriangle />
              <div>
                <p><strong>Out of Stock</strong></p>
                <p>This product is currently unavailable. Please check back later.</p>
              </div>
            </div>
          );
        case 'size':
          return (
            <div className="error-message">
              <FaInfoCircle />
              <p>Please select a size to continue</p>
            </div>
          );
        case 'general':
          return (
            <div className="error-message">
              <FaExclamationTriangle />
              <p>{error || "Something went wrong. Please try again."}</p>
            </div>
          );
        default:
          return null;
      }
    };

    const renderTabContent = () => {
      switch (activeTab) {
        case 'description':
          return (
            <div>
              <p className="description">{product.description}</p>
              <div className="key-features">
                <h3>Key Features</h3>
                <div className="key-text">
                  {product.keyFeatures && product.keyFeatures.map((feature, index) => (
                    <p key={index}>{feature}</p>
                  ))}
                </div>
                {product.technicalSpecs && Object.keys(product.technicalSpecs).length > 0 && (
                  <div className="technical-specs">
                    <h3>Technical Specifications</h3>
                    <div className="specs-list">
                      {Object.entries(product.technicalSpecs).map(([key, value]) => (
                        <div key={key} className="spec-item">
                          <span className="spec-name">{key}:</span>
                          <span className="spec-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        case 'shipping':
          return (
            <div className="shipping-grid">
              {Object.entries(shippingInfo).map(([key, value]) => (
                <div key={key} className="shipping-item">
                  {key === 'delivery' && <FaTruck className="shipping-icon" />}
                  {key === 'security' && <FaShieldAlt className="shipping-icon" />}
                  {key === 'tracking' && <FaClock className="shipping-icon" />}
                  {key === 'warranty' && <FaBox className="shipping-icon" />}
                  <p>{value}</p>
                </div>
              ))}
            </div>
          );
        case 'reviews':
          return (
            <div className="reviews-container">
              <form onSubmit={handleRatingSubmit} className="review-form">
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Enter your name (optional)"
                  />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <div className="stars-container">
                    {renderStars(userRating, 5, true)}
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review..."
                    required
                  />
                </div>
                <button className='review-content-btn' type="submit">Submit Review</button>
              </form>

              <div className="reviews-list">
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <span className="reviewer-name">{review.name}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-stars">
                      {renderStars(review.rating)}
                    </div>
                    <p className="review-text">{review.comment}</p>
                  </div>
                ))}
                {reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="view-all-btn"
                  >
                    {showAllReviews ? 'Show Less' : `View All ${reviews.length} Reviews`}
                  </button>
                )}
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="product-display-wrapper">
        <MetaTags />
        <div className="product-container">
          {/* Main product display area - Modified to match the layout in the image */}
          <div className="product-main-section">
            {/* Left side - Product images section */}
            <div className="left-column">
              <div className="main-image-container">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className={`main-image ${is3DView ? "rotate-3d" : ""}`}
                />
              </div>
              
              <div className="thumbnail-grid">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => handleImageClick(image.url)}
                      className={`thumbnail ${
                        selectedImage === image.url ? "selected" : ""
                      }`}
                    >
                      <img src={image.url} alt={image.alt} />
                    </div>
                  ))
                ) : (
                  <div
                    onClick={() => handleImageClick(product.image)}
                    className="thumbnail selected"
                  >
                    <img src={product.image} alt={product.name} />
                  </div>
                )}
              </div>
              
              <div className="product-sharing">
                <h4>Share this product</h4>
                <div className="social-icons">
                  <button onClick={() => handleShare('facebook')} className="social-icon facebook">
                    <Facebook size={20} />
                  </button>
                  <button onClick={() => handleShare('twitter')} className="social-icon twitter">
                    <Twitter size={20} />
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="social-icon linkedin">
                    <Linkedin size={20} />
                  </button>
                  <button onClick={() => handleShare('whatsapp')} className="social-icon whatsapp">
                    <FaWhatsapp size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - Product info and actions */}
            <div className="right-column">
              <div className="product-info">
                <h1 className="product-title">{product.name}</h1>
                <div className="price-container">
                  <span className="new-price">Ksh {product.new_price}</span>
                  {product.old_price && (
                    <span className="old-price">Ksh {product.old_price}</span>
                  )}
                  {product.old_price && (
                    <div className="savings-tag">Save {percentageSavings}%</div>
                  )}
                </div>
                <div className="rating-row">
                  {renderStars(4)}
                  <span className="review-count">({reviews.length} Reviews)</span>
                </div>

                <div className="stock-status">
                  <span className={`stock-indicator ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                    {isInStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {renderErrorMessage()}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="size-selection">
                    <label>Select Size:</label>
                    <div className="size-buttons">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="action-buttons">
                  {currentQuantity > 0 ? (
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleQuantityChange(-1)}
                        disabled={currentQuantity <= 0}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity-display">{currentQuantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(1)}
                        disabled={currentQuantity >= 10000}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={handleAddToCart}
                        className={`cart-btn ${addedToCart ? 'added' : ''} ${!isInStock ? 'disabled' : ''}`}
                        disabled={!isInStock}
                      >
                        {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                      </button>
                      
                      <a 
                        href={whatsappLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="whatsapp-btn"
                      >
                        <FaWhatsapp />
                        Order on WhatsApp
                      </a>
                    </>
                  )}
                </div>
                
                <div className="delivery-info">
                  <div className="delivery-item">
                    <FaTruck className="delivery-icon" />
                    <span>Fast delivery available</span>
                  </div>
                  <div className="delivery-item">
                    <FaShieldAlt className="delivery-icon" />
                    <span>Secure payments</span>
                  </div>
                  <div className="delivery-item">
                  <FaUndo  className='delivery-icon'/>
                  <span>Easy Return policy</span>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Tabs section - Below the main product display */}
          <div className="tabs-container">
            <div className="tabs-header">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="tab-content">
              {renderTabContent()}
            </div>
          </div>
        </div>

        <div className="related">
          <RelatedProduct 
            currentCategory={product?.category}
            currentProductId={product?.id}
          />
        </div>
        <ToastContainer position="top" />
      </div>
    );
};

export default ProductDisplay;
