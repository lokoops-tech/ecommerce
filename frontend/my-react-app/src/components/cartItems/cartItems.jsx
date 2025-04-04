import React, { useMemo, useCallback, useEffect } from "react";
import { useShop } from "../../context/ShopContext";
import { Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GichTechDelivery from "../../pages/DeliveryInfo";
import "./cartItems.css";

const CartItems = () => {
    const {
        cartState,
        all,
        removeFromCart,
        updateCartItemQuantity,
        loading,
        validateCart,
    } = useShop();

    const navigate = useNavigate();

    // Debug: Log entire cart state on component render and updates
    useEffect(() => {
        console.log('Full Cart State:', cartState);
    }, [cartState]);

    // Filter valid products with comprehensive error handling and logging
    const validProducts = useMemo(() => {
        console.log('All Products Input:', all);
        
        if (!all) {
            console.warn('No products available');
            return [];
        }
        
        if (!Array.isArray(all)) {
            console.error("'all' is not an array:", all);
            return [];
        }
        
        const filtered = all.filter(p => {
            const isValid = p && p.id;
            if (!isValid) {
                console.warn('Invalid product found:', p);
            }
            return isValid;
        });
        
        console.log('Valid Products:', filtered);
        return filtered;
    }, [all]);

    // Memoize cart items calculation with detailed logging
    const cartItemsToShow = useMemo(() => {
        console.log('Current cart state items:', cartState.items);
        console.log('Valid products for cart:', validProducts);
        
        const itemsToShow = validProducts.filter(product => {
            const cartItem = cartState.items[product.id];
            const isInCart = cartItem?.quantity > 0;
            const isInStock = product.stockStatus === 'IN_STOCK';
            
            console.log(`Product ${product.id} cart check:`, {
                cartItem,
                isInCart,
                isInStock
            });
            
            return isInCart && isInStock;
        });
        
        console.log('Cart Items to Show:', itemsToShow);
        return itemsToShow;
    }, [validProducts, cartState.items]);

    // Memoize subtotal calculation
    const subtotal = useMemo(() => {
        return cartItemsToShow.reduce((total, product) => {
            const quantity = cartState.items[product.id]?.quantity || 0;
            const price = Number(product.new_price) || 0;
            return total + (price * quantity);
        }, 0);
    }, [cartItemsToShow, cartState.items]);

    const handleQuantityChange = async (product, newQuantity) => {
        try {
            if (product.stockStatus === 'OUT_OF_STOCK') {
                toast.error('Product is out of stock');
                return;
            }
            
            if (newQuantity >= 1) {
                await updateCartItemQuantity(product.id, newQuantity);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleIncrement = useCallback((product) => {
        const currentQuantity = cartState.items[product.id]?.quantity || 0;
        handleQuantityChange(product, currentQuantity + 1);
    }, [cartState.items]);

    const handleDecrement = useCallback((product) => {
        const currentQuantity = cartState.items[product.id]?.quantity || 0;
        if (currentQuantity > 1) {
            handleQuantityChange(product, currentQuantity - 1);
        }
    }, [cartState.items]);

    const handleRemoveFromCart = useCallback(async (productId) => {
        console.log('Attempting to remove product:', productId);
        console.log('Current cart items before removal:', cartState.items);

        try {
            // Optimistically update the UI
            const updatedCartItemsToShow = cartItemsToShow.filter(
                product => product.id !== productId
            );

            console.log('Cart items after optimistic removal:', updatedCartItemsToShow);

            // Remove the item from cart
            await removeFromCart(productId);

            console.log('Remove from cart completed');

            // If cart is now empty, redirect
           
        } catch (err) {
            console.error('Error removing item:', err);
            toast.error(err.message || "Failed to remove item from cart");
        }
    }, [removeFromCart, cartItemsToShow, navigate, cartState.items]);

    const handleProceedToCheckout = useCallback(async () => {
        try {
            await validateCart();
            if (cartItemsToShow.length > 0) {
                navigate("/cart/checkout");
            } else {
                toast.error("Your cart is empty!");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [cartItemsToShow.length, validateCart, navigate]);

    // Loading state
    if (loading) {
        return <div className="page-cart-loading">Loading cart...</div>;
    }

    // Empty cart state
    if (cartItemsToShow.length === 0) {
        return (
            <div className="page-cart-empty">
                <div className="empty-cart-icon">
                    <ShoppingCart 
                        size={80} 
                        strokeWidth={2.5} 
                        className="sharp-cart-icon"
                    />
                </div>
                <h2>Your cart is empty</h2>
                <button 
                    className="shop-now-btn"
                    onClick={() => navigate('/')} // Navigates to homepage
                >
                    Shop Now
                </button>
            </div>
        );
    }


    // Render cart items
    return (
        <>
        <div className="page-cart-container">
            <ToastContainer position="top-right" />

            <div className="page-cart-products-section">
                <h1 className="page-cart-title">Cart ({cartItemsToShow.length})</h1>

                {cartItemsToShow.map((product) => {
                    if (!product) {
                        console.error("Product is undefined inside map function");
                        return null;
                    }

                    const quantity = cartState.items[product.id]?.quantity || 0;
                    const stockAvailable = product.stock;
                    const isLowStock = stockAvailable <= 5 && stockAvailable > 0;

                    return (
                        <div key={product.id} className="page-cart-product-item">
                            <div className="page-cart-product-left">
                                <div className="page-cart-product-details">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="page-cart-product-image"
                                    />
                                    <p className="page-cart-product-name">{product.name}</p>
                                    {isLowStock && (
                                        <p className="page-cart-product-low-stock">Few units left</p>
                                    )}
                                </div>
                                <div className="page-cart-remove-button">
    <button 
        onClick={() => handleRemoveFromCart(product.id)}
        className="page-cart-remove-btn"
    >
        <div className="page-cart-remove-btn-content">
            <Trash2 size={20} />
        </div>
    </button>
</div>
                            </div>
                            
                            <div className="page-cart-product-right">
                                <p className="page-cart-product-price">KSh {product.new_price.toLocaleString()}</p>
                                
                                <div className="page-cart-quantity-control">
                                    <button
                                        className="page-cart-quantity-btn"
                                        onClick={() => handleDecrement(product)}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="page-cart-quantity-display">{quantity}</span>
                                    <button
                                        className="page-cart-quantity-btn"
                                        onClick={() => handleIncrement(product)}
                                        disabled={quantity >= stockAvailable}
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <p className="page-cart-product-total">KSh {(product.new_price * quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="page-cart-summary-section">
                <div className="page-cart-summary-content">
                    <h2 className="page-cart-summary-title">Cart Summary</h2>
                    <div className="page-cart-summary-subtotal">
                        <span>Subtotal</span>
                        <span>KSh {subtotal.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="page-cart-summary-total">
                        <span>Total</span>
                        <span>KSh {subtotal.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={handleProceedToCheckout}
                        className="page-cart-checkout-btn"
                    >
                        Checkout (KSh {subtotal.toLocaleString()})
                    </button>
                </div>
            </div>
        </div>
        <div className="customer-satisfaction">
       <GichTechDelivery/>
        </div>
        </>
    );
};

export default CartItems;