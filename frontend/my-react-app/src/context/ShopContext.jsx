import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast, } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


const getDefaultCart = () => ({
    items: {},  // Initialize as empty object
    lastUpdated: new Date().toISOString(),
    status: 'idle',
    error: null,
    total: 0,
    count: 0,  // Add item count
    isValid: true  // Add validation state
});

const API_BASE_URL = "http://localhost:4000";

// Enhanced default cart with stockStatus

export const shopContext = createContext({
    all: [],
    filteredProducts: [],
    loading: false,
    error: null,
    cartState: getDefaultCart(),
    orders: [],
    // Add other default values here
});



export const useShop = () => useContext(shopContext);

const ShopContextProvider = (props) => {
    console.log("ShopContextProvider initializing");
    const [all, setAll] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [loading, setLoading] = useState(true);
    const [userState, setUserState] = useState({
        email: null,});
    const [cartState, setCartState] = useState(() => {
        console.log("Initializing cart state"); // Debug log
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                console.log("Found saved cart:", parsedCart); // Debug log
                
                // Validate parsed cart structure
                if (!parsedCart || typeof parsedCart !== 'object') {
                    throw new Error('Invalid cart structure');
                }

                // Ensure items is an object and validate its content
                const validatedItems = parsedCart.items && typeof parsedCart.items === 'object' 
                    ? Object.entries(parsedCart.items).reduce((acc, [key, item]) => {
                        if (item && typeof item === 'object') {
                            acc[key] = {
                                ...item,
                                quantity: parseInt(item.quantity) || 0
                            };
                        }
                        return acc;
                    }, {})
                    : {};

                return {
                    ...getDefaultCart(),
                    ...parsedCart,
                    items: validatedItems,
                    lastUpdated: new Date().toISOString()
                };
            } catch (error) {
                console.error("Failed to parse saved cart:", error);
                localStorage.removeItem("cart"); // Clear invalid cart data
                return getDefaultCart();
            }
        }
        return getDefaultCart();
    });
    // Add to ShopContext.jsx
const handleUserLogin = async (userData, authToken) => {
    try {
      // Hash the email for verification purposes
      const emailHash = await hashEmail(userData.email);
      
      // Encrypt the email using the auth token
      const encryptedEmail = encryptEmail(userData.email, authToken);
      
      // Store in localStorage
      localStorage.setItem("email-hash", emailHash);
      localStorage.setItem("encrypted-email", encryptedEmail);
      localStorage.setItem("auth-token", authToken);
      
      // Also store the email in your app state for immediate use
      setUserState(prev => ({
        ...prev,
        email: userData.email
      }));
      
      return true;
    } catch (error) {
      console.error("Failed to handle user login data:", error);
      return false;
    }
  };

    
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCartState(parsedCart);
            } catch (error) {
                console.error("Failed to parse cart from localStorage:", error);
                localStorage.removeItem("cart");
                setCartState(getDefaultCart());
            }
        }
    }, []);

    // Save cart to localStorage whenever cartState changes
    useEffect(() => {
        try {
            if (cartState && typeof cartState === 'object') {
                localStorage.setItem("cart", JSON.stringify(cartState));
            }
        } catch (error) {
            console.error("Failed to save cart to localStorage:", error);
        }
    }, [cartState]);
 
    // Fetch all products and cart data on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/product/allproducts`);
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                
                // Extract the products array from the response
                const productsArray = data.products || [];
                
                setAll(productsArray);
                setFilteredProducts(productsArray);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, []);



  // Validate stock status before adding to cart
const validateStockStatus = useCallback(async (itemId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/product/${itemId}/status`);
        if (!response.ok) throw new Error('Failed to check product status');
        
        const { stockStatus } = await response.json();
        
        if (stockStatus === 'OUT_OF_STOCK') {
            throw new Error('Product is currently out of stock');
        }
        
        return true;
    } catch (error) {
        console.error('Stock status check failed:', error);
        throw error;
    }
}, []);

// Fetch current stock status for all products
const fetchStockStatus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/stockUpdate/getstatus`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch stock status');
        }

        const { data, success } = await response.json();

        if (!success) {
            throw new Error('Failed to fetch stock status data');
        }

        // Ensure we have the products array
        if (!data || !data.products) {
            throw new Error('Invalid stock status data received');
        }

        return {
            success: true,
            data: data.products.map(product => ({
                id: product.id,
                name: product.name,
                stockStatus: product.stockStatus,
                lastUpdated: product.lastUpdated
            }))
        };

    } catch (error) {
        console.error('Error fetching stock status:', error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
};

// Usage example:
const updateProductStatus = async () => {
    try {
        const result = await fetchStockStatus();
        if (result.success) {
            // Update your UI with the stock status
            const products = result.data;
            // Handle the products data
        } else {
            // Handle the error state
            console.error('Failed to fetch stock status:', result.error);
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error('Unexpected error:', error);
    }
};
 const fetchCartData = useCallback(async () => {
        const authToken = localStorage.getItem("auth-token");

        console.log("Auth token in fetchCartData:", authToken);

        if (!authToken) {
            console.warn("No authentication token available");
            return null;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cart/getcart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": authToken
                }
            });

            console.log("Cart fetch response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched cart data:", data);

            setCartState(prev => ({
                ...prev,
                ...data.cart,
                status: "idle",
                lastUpdated: new Date().toISOString()
            }));

            return data;
        } catch (error) {
            console.error("Cart fetch error:", error);
            throw error;
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        const initializeCart = async () => {
            try {
                const authToken = localStorage.getItem("auth-token");
                const tokenExpiry = localStorage.getItem("token-expiry");

                console.log("Auth token before validation:", authToken);
                console.log("Token expiry:", tokenExpiry ? new Date(Number(tokenExpiry)).toLocaleString() : "Not set");

                const isTokenValid = authToken && tokenExpiry && Date.now() < Number(tokenExpiry);

                if (isTokenValid) {
                    console.log("Valid auth token found, attempting to fetch cart data");

                    try {
                        await fetchCartData();
                        console.log("Cart data successfully fetched from backend");
                    } catch (fetchError) {
                        console.error("Failed to fetch cart data:", fetchError);
                        localStorage.removeItem("email-hash");
                        localStorage.removeItem("encrypted-email");

                        const savedCart = localStorage.getItem("cart");
                        if (savedCart) {
                            try {
                                const parsedCart = JSON.parse(savedCart);
                                setCartState(prev => ({
                                    ...prev,
                                    ...parsedCart,
                                    status: "idle"
                                }));
                                console.log("Loaded cart from localStorage as fallback");
                            } catch (parseError) {
                                console.error("Failed to parse saved cart:", parseError);
                                localStorage.removeItem("cart");
                                setCartState(getDefaultCart());
                            }
                        } else {
                            setCartState(getDefaultCart());
                        }
                    }
                } else {
                    console.log("No valid auth token, checking localStorage");
                    localStorage.removeItem("email-hash");
                    localStorage.removeItem("encrypted-email");

                    const savedCart = localStorage.getItem("cart");
                    if (savedCart) {
                        try {
                            const parsedCart = JSON.parse(savedCart);
                            setCartState(prev => ({
                                ...prev,
                                ...parsedCart,
                                status: "idle",
                                lastUpdated: new Date().toISOString()
                            }));
                            console.log("Loaded validated cart from localStorage");
                        } catch (error) {
                            console.error("Failed to parse cart from localStorage:", error);
                            localStorage.removeItem("cart");
                            setCartState(getDefaultCart());
                        }
                    } else {
                        setCartState(getDefaultCart());
                        console.log("No cart data found, initialized default cart");
                    }
                }
            } catch (error) {
                console.error("Unexpected error in cart initialization:", error);
                setCartState(getDefaultCart());
            }
        };

        const initTimer = setTimeout(() => {
            initializeCart();
        }, 100);

        return () => {
            clearTimeout(initTimer);
        };
    }, [fetchCartData]);


// Keep filtered products in sync with all products
useEffect(() => {
    setFilteredProducts(all);
}, [all]);



useEffect(() => {
    const initCart = async () => {
        const authToken = localStorage.getItem("auth-token");
        if (authToken) {
            console.log("Fetching initial cart data"); 
            await fetchCartData();
        } else {
            setCartState(getDefaultCart()); // Reset if no auth
        }
    };
    initCart();
}, [fetchCartData]); 

// Update cart in localStorage
useEffect(() => {
    if (cartState) {
        localStorage.setItem("cart", JSON.stringify(cartState));
    }
}, [cartState]);


const updateCartItemQuantity = useCallback(async (itemId, quantity) => {
    try {
        // Validate quantity
        if (quantity < 0) {
            throw new Error("Quantity cannot be negative");
        }
        
        // Check if the product exists
        const product = all.find(p => p.id === Number(itemId));
        if (!product) {
            throw new Error(`Product with ID ${itemId} not found`);
        }
        
        // Check stock status
        if (product.stockStatus === 'OUT_OF_STOCK') {
            throw new Error('This product is currently out of stock');
        }

        // Update cart with authenticated user
        const authToken = localStorage.getItem("auth-token");
        if (!authToken) {
            throw new Error("Authentication required");
        }

        // Prepare full product details for backend
        const updatePayload = {
            itemId,
            quantity,
            productDetails: {
                id: product.id,
                name: product.name,
                description: product.description,
                category: product.category,
                subcategory: product.subcategory,
                image: product.image,
                new_price: product.new_price,
                old_price: product.old_price,
                sizes: product.sizes,
                keyFeatures: product.keyFeatures,
                brand: product.brand,
                stockStatus: product.stockStatus
            }
        };

        const response = await fetch(`${API_BASE_URL}/cart/updatecart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authToken
            },
            body: JSON.stringify(updatePayload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update cart");
        }

        const responseData = await response.json();
        
        // Update cart state with comprehensive item structure
        setCartState(prev => {
            const prevItems = prev.items || {};
            
            const updatedItem = {
                ...product,
                quantity: quantity,
                totalPrice: product.new_price * quantity,
                lastUpdated: new Date().toISOString(),
                stockStatus: product.stockStatus
            };
            
            const updatedItems = {
                ...prevItems,
                [itemId]: updatedItem
            };

            const newCartState = {
                ...prev,
                items: updatedItems,
                status: 'success',
                lastUpdated: new Date().toISOString(),
                total: Object.values(updatedItems).reduce(
                    (total, item) => total + (item.new_price * item.quantity), 
                    0
                ),
                count: Object.values(updatedItems).reduce(
                    (count, item) => count + item.quantity, 
                    0
                )
            };

            // Persist updated cart to localStorage
            localStorage.setItem("cart", JSON.stringify(newCartState));

            return newCartState;
        });
        
        // Optional: Fetch latest cart data to ensure sync
        await fetchCartData();
        
        toast.success('Cart updated successfully');
        
        return responseData;
        
    } catch (error) {
        console.error("Cart update error:", error);
        toast.error(error.message);
        throw error;
    }
}, [all, setCartState, fetchCartData]);



    // Check if an item is in the cart
const isItemInCart = useCallback((itemId) => {
    try {
        return Boolean(cartState?.items?.[itemId]?.quantity);
    } catch {
        return false;
    }
}, [cartState]);

// Calculate total number of items in cart
const getTotalCartItems = useCallback(() => {
    try {
        if (!cartState?.items || typeof cartState.items !== 'object') {
            return 0;
        }
        
        return Object.values(cartState.items).reduce((sum, item) => {
            const quantity = Number(item?.quantity) || 0;
            return sum + quantity;
        }, 0);
    } catch {
        return 0;
    }
}, [cartState]);

// Calculate total cart amount
const getTotalCartAmount = useCallback(() => {
    if (!cartState?.items) {
        return 0;
    }

    try {
        const total = Object.entries(cartState.items || {}).reduce((sum, [itemId, item]) => {
            if (!item) return sum;
            
            const product = all.find(p => p?.id?.toString() === itemId.toString());
            if (!product) return sum;

            const price = Number(product.new_price) || 0;
            const quantity = Number(item.quantity) || 0;

            return sum + (price * quantity);
        }, 0);

        return total;
    } catch (error) {
        console.error("Error calculating total cart amount:", error);
        return 0;
    }
}, [cartState, all]);

// Fetch current cart status
const fetchCartStatus = useCallback(() => {
    const status = {
        items: cartState.items,
        total: getTotalCartAmount(),
        count: getTotalCartItems(),
        lastUpdated: new Date().toISOString()
    };

    setCartState(prev => ({
        ...prev,
        ...status,
        status: 'success'
    }));

    return status;
}, [cartState.items, getTotalCartAmount, getTotalCartItems]);


//update stock
const updateStockStatus = useCallback(async () => {
    try {
        // Initialize cart items safely
        const cartItems = cartState?.items || {};
        
        // Get valid item IDs
        const itemIds = Object.keys(cartItems).filter(Boolean);
        
        // If no items in cart, return early
        if (itemIds.length === 0) {
            return;
        }

        // Fetch status for all cart items
        const response = await fetch(`${API_BASE_URL}/stockUpdate/getstatus`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch product status');
        }

        const { success, data } = await response.json();

        if (!success || !data || !data.products) {
            throw new Error('Invalid response format from server');
        }

        // Create a map of product statuses
        const productStatusMap = data.products.reduce((acc, product) => {
            if (itemIds.includes(product.id)) {
                acc[product.id] = product.stockStatus;
            }
            return acc;
        }, {});

        // Only update cart if there are status changes
        const hasStatusChanges = Object.keys(productStatusMap).some(
            id => productStatusMap[id] !== cartItems[id]?.stockStatus
        );

        if (hasStatusChanges) {
            setCartState(prev => ({
                ...prev,
                items: Object.fromEntries(
                    Object.entries(cartItems).map(([id, item]) => [
                        id,
                        {
                            ...item,
                            stockStatus: productStatusMap[id] || 'OUT_OF_STOCK'
                        }
                    ])
                ),
                lastUpdated: new Date().toISOString()
            }));
        }

    } catch (error) {
        console.error('Stock status update failed:', error);
        
        // More detailed error handling
        if (error.response) {
            // Server responded with error
            setError(`Status update failed: ${error.response.data?.message || 'Server error'}`);
        } else if (error.request) {
            // No response received
            setError('Network error: Could not reach server');
        } else {
            // Other errors
            setError(`Failed to update stock status: ${error.message}`);
        }
    }
}, [cartState, setCartState, setError]);

// Optional: Add a function to check single product status
const checkSingleProductStatus = async (productId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/stockUpdate/getstatus/${productId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch product status');
        }

        const { success, data } = await response.json();

        if (!success || !data) {
            throw new Error('Invalid response format');
        }

        return {
            success: true,
            stockStatus: data.stockStatus,
            lastUpdated: data.lastUpdated
        };

    } catch (error) {
        console.error(`Failed to check status for product ${productId}:`, error);
        return {
            success: false,
            error: error.message,
            stockStatus: 'OUT_OF_STOCK'
        };
    }
};
  

// Periodic status updates
useEffect(() => {
    const intervalId = setInterval(() => {
        updateStockStatus();
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
}, [updateStockStatus]);

// Toast configuration
const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
};

const addToCart = useCallback(async (itemId, quantity = 1) => {
    const authToken = localStorage.getItem("auth-token");
    
    // Check authentication first
    if (!authToken) {
        toast.error('Please log in to add items to cart', {
            ...toastConfig,
            onClick: () => {
                // Optional: Navigate to login page
                // navigate('/login');
            }
        });
        throw new Error("Authentication required");
    }

    try {
        const product = all.find(p => p.id === Number(itemId));
        if (!product) {
            toast.error(`Product not found`, toastConfig);
            throw new Error(`Product with ID ${itemId} not found`);
        }

        if (product.stockStatus === 'OUT_OF_STOCK') {
            toast.warning('This product is currently out of stock', toastConfig);
            throw new Error('This product is currently out of stock');
        }

        const requestBody = {
            itemId,
            quantity,
            productDetails: {
                id: product.id,
                name: product.name,
                description: product.description,
                category: product.category,
                subcategory: product.subcategory,
                image: product.image,
                new_price: product.new_price,
                old_price: product.old_price,
                sizes: product.sizes,
                keyFeatures: product.keyFeatures,
                brand: product.brand,
                stockStatus: product.stockStatus
            }
        };

        // Show loading toast
        const loadingToastId = toast.loading('Adding to cart...', toastConfig);

        await fetchCartData();

        // Optimistic UI update
        const currentCartQuantity = cartState.items[itemId]?.quantity || 0;
        const newTotalQuantity = currentCartQuantity + quantity;

        const updatedCartState = {
            ...cartState,
            items: {
                ...cartState.items,
                [itemId]: {
                    ...product,
                    quantity: newTotalQuantity,
                    totalPrice: product.new_price * newTotalQuantity
                }
            },
            status: 'pending',
            lastUpdated: new Date().toISOString()
        };

        setCartState(updatedCartState);
        localStorage.setItem("cart", JSON.stringify(updatedCartState));

        // Send request to backend
        const response = await fetch(`${API_BASE_URL}/cart/addtocart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": authToken,
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            // Update loading toast to error
            toast.update(loadingToastId, {
                render: errorData.message || "Failed to add item to cart",
                type: "error",
                isLoading: false,
                ...toastConfig
            });
            throw new Error(errorData.message || "Failed to add item to cart");
        }

        const responseData = await response.json();
        
        // Update stock status after successful addition
        updateStockStatus();

        // Update loading toast to success
        toast.update(loadingToastId, {
            render: `${product.name} added to cart successfully`,
            type: "success",
            isLoading: false,
            ...toastConfig
        });

        return {
            success: true,
            message: 'Item added to cart',
            newQuantity: newTotalQuantity,
            product: product,
            ...responseData
        };

    } catch (error) {
        // Rollback on failure
        setCartState(prev => ({
            ...prev,
            status: 'error',
            error: error.message
        }));

        // Only show error toast if it's not an authentication error
        // (authentication error toast is already shown above)
        if (error.message !== "Authentication required") {
            toast.error(error.message, toastConfig);
        }
        
        throw error;
    }
}, [all, cartState, updateStockStatus]);


// Add a cart recovery mechanism
useEffect(() => {
    const recoverCart = async () => {
        const authToken = localStorage.getItem("auth-token");
        if (!authToken) return;

        if (!cartState.items || Object.keys(cartState.items).length === 0) {
            console.log("Empty cart detected, attempting recovery");
            await fetchCartData();
        }
    };

    window.addEventListener('focus', recoverCart);
    return () => window.removeEventListener('focus', recoverCart);
}, [fetchCartData, cartState.items]);

// Cart sync effect
useEffect(() => {
    if (!localStorage.getItem("auth-token") || cartState.status === 'pending') return;

    const syncInterval = setInterval(() => {
        fetchCartData();
    }, 300000); // Sync every 5 minutes

    return () => clearInterval(syncInterval);
}, [fetchCartData, cartState.status]);

// Remove from cart function
const removeFromCart = useCallback(async (itemId) => {
    const authToken = localStorage.getItem("auth-token");
    if (!authToken) throw new Error("Authentication required");

    try {
        const response = await fetch(`${API_BASE_URL}/cart/removefromcart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": authToken,
            },
            body: JSON.stringify({ itemId }),
        });

        if (!response.ok) throw new Error("Failed to remove item from cart");

        const data = await response.json();

        setCartState((prev) => {
            const newItems = { ...prev.items };
            if (newItems[itemId] && newItems[itemId].quantity > 1) {
                newItems[itemId].quantity -= 1;
            } else {
                delete newItems[itemId];
            }

            return {
                ...prev,
                items: newItems,
                total: data.total || prev.total,
                status: 'success',
                lastUpdated: new Date().toISOString()
            };
        });

        // Update stock status after removal
        updateStockStatus();

        toast.success("Item removed from cart successfully");
    } catch (error) {
        toast.error(error.message);
        throw error;
    }
}, [updateStockStatus]);


   // Cleanup function for cart operations
const cleanupCartOperations = useCallback(() => {
    setCartState(prev => ({
        ...prev,
        status: 'idle',
        error: null
    }));
}, []);

// Effect for cart operations cleanup
useEffect(() => {
    if (cartState.status === 'success' || cartState.status === 'error') {
        const timeout = setTimeout(cleanupCartOperations, 2000);
        return () => clearTimeout(timeout);
    }
}, [cartState.status, cleanupCartOperations]);

// Persist cart to localStorage
useEffect(() => {
    if (cartState && typeof cartState === 'object') {
        localStorage.setItem("cart", JSON.stringify(cartState));
    }
}, [cartState]);


//clearcart
const clearCart = useCallback(async () => {
    console.log("clearCart function called...");

    const authToken = localStorage.getItem("auth-token");
    let toastId = null;

    const clearLocalCart = () => {
        console.log("Clearing local cart...");
        setCartState(getDefaultCart());
        localStorage.removeItem("cart");
    };

    if (!authToken) {
        clearLocalCart();
        toast.success("Cart cleared successfully", { autoClose: 3000 });
        return;
    }

    try {
       // Store the toast ID when displaying it
        const toastId = toast.loading("Clearing cart...", { closeOnClick: true });

// Dismiss manually after the API call
             toast.dismiss(toastId);

        const response = await fetch(`${API_BASE_URL}/cart/clearcart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": authToken,
            },
        });

        clearLocalCart();

        console.log("API Response Status:", response.status);
        console.log("API Response Headers:", response.headers);

        const responseData = response.headers.get("content-type")?.includes("application/json")
            ? await response.json()
            : null;

        console.log("API Response Data:", responseData);

        if (response.ok) {
            toast.update(toastId, {
                render: "Cart cleared successfully",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true
            });
        } else {
            toast.update(toastId, {
                render: "Cart cleared",
                type: "info",
                isLoading: false,
                autoClose: 1500,
                closeOnClick: true
            });

            console.error("Clear cart error:", responseData?.message || "Failed to clear cart");
        }
    } catch (error) {
        clearLocalCart();
        if (toastId) {
            toast.update(toastId, {
                render: "Cart cleared",
                type: "info",
                isLoading: false,
                autoClose: 1500,
                closeOnClick: true
            });
        }
        console.error("Clear cart error:", error);
    }
}, []);

   // Check stock status for a single item
const checkStock = useCallback(async (itemId) => {
    const product = all.find(p => p.id === Number(itemId));
    return product ? product.stockStatus === 'IN_STOCK' : false;
}, [all]);

// Check stock status for multiple items
const checkStocks = useCallback(async (items) => {
    try {
        const stockChecks = await Promise.all(
            items.map(async item => {
                const hasStock = await checkStock(item.id);
                if (!hasStock) {
                    throw new Error(`${item.name} is currently out of stock`);
                }
                return true;
            })
        );
        return stockChecks.every(check => check === true);
    } catch (error) {
        throw error;
    }
}, [checkStock]);

// Check stock status for all cart items
const checkCartStock = useCallback(async () => {
    try {
        const cartItems = Object.entries(cartState.items).map(([itemId, item]) => ({
            id: itemId,
            name: item.name || 'Unknown',
            quantity: item.quantity
        }));
        return await checkStocks(cartItems);
    } catch (error) {
        throw error;
    }
}, [cartState.items, checkStocks]);

// Validate cart items against stock status
const validateCart = useCallback(async () => {
    try {
        console.log("Cart State:", cartState);
        console.log("Cart Items:", cartState?.items);

        if (!cartState?.items) {
            console.log("No cart items found");
            return true; // Empty cart is valid
        }

        console.log("About to process cart items with Object.entries");
        
        const cartItems = cartState.items || {};
        console.log("Cart Items before Object.entries:", cartItems);

        const outOfStockItems = Object.entries(cartItems)
            .filter(([itemId, item]) => {
                console.log("Processing item:", { itemId, item });
                if (!item) {
                    console.log("Skipping null/undefined item");
                    return false;
                }
                const product = all.find(p => p.id === Number(itemId));
                console.log("Found product:", product);
                return product?.stockStatus === 'OUT_OF_STOCK';
            });

        console.log("Out of stock items:", outOfStockItems);

        if (outOfStockItems.length > 0) {
            const itemNames = outOfStockItems
                .map(([_, item]) => {
                    console.log("Mapping item for name:", item);
                    return item?.name || 'Unknown item';
                })
                .join(', ');
            throw new Error(`The following items are out of stock: ${itemNames}`);
        }
        return true;
    } catch (error) {
        console.error("Error in validateCart:", error);
        throw error;
    }
}, [cartState?.items, all]);
 // Updated to fetch orders using only the auth token
 const getOrders = useCallback(async () => {
    setLoading(true);
    try {
        const authToken = localStorage.getItem("auth-token");
        if (!authToken) {
            setLoading(false);
            setError("Authentication required to fetch orders");
            return [];
        }

        const response = await fetch(`${API_BASE_URL}/order/user-orders`, {
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch orders");
        }

        if (!data.success || !Array.isArray(data.orders)) {
            throw new Error("Invalid response format from server");
        }

        const enhancedOrders = data.orders.map(order => {
            if (!order || !Array.isArray(order.items)) {
                console.warn("Invalid order format:", order);
                return null;
            }

            return {
                ...order,
                items: order.items.map(item => {
                    if (!item || !item.productId) {
                        console.warn("Invalid item format:", item);
                        return null;
                    }

                    const product = all.find(p => p?.id === Number(item.productId));
                    return {
                        ...item,
                        name: product?.name || item.name || "Unknown Product",
                        description: product?.description || item.description || "",
                        image: product?.image || item.image || "",
                        brand: product?.brand || item.brand || "",
                        category: product?.category || item.category || "",
                        subcategory: product?.subcategory || item.subcategory || "",
                        sizes: Array.isArray(product?.sizes) ? product.sizes : [],
                        keyFeatures: Array.isArray(product?.keyFeatures) ? product.keyFeatures : [],
                        price: Number(product?.new_price) || Number(item.price) || 0,
                        old_price: Number(product?.old_price) || Number(item.old_price) || 0,
                        stockStatus: product?.stockStatus || 'OUT_OF_STOCK'
                    };
                }).filter(Boolean) // Remove null items
            };
        }).filter(Boolean); // Remove null orders

        setOrders(enhancedOrders);
        setError(null);
        return enhancedOrders;

    } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to fetch orders");
        return [];
    } finally {
        setLoading(false);
    }
}, [all]);



// Updated placeOrder to use only auth token for user identification
const placeOrder = useCallback(async (orderData) => {
    setLoading(true);
    const totalCartAmount = getTotalCartAmount();
    const deliveryFee = Number(orderData.deliveryFee) || 0;
    const grandTotal = totalCartAmount + deliveryFee;

    try {
        const authToken = localStorage.getItem("auth-token");
        if (!authToken) throw new Error("Authentication required");

        // Validate cart totals
        if (isNaN(totalCartAmount) || totalCartAmount <= 0) {
            throw new Error('Invalid cart amount');
        }

        if (isNaN(deliveryFee)) {
            throw new Error('Invalid delivery fee');
        }

        if (isNaN(grandTotal)) {
            throw new Error('Invalid total calculation');
        }

        // Prepare enhanced items with complete product details
        const enhancedItems = Object.entries(cartState.items).map(([itemId, item]) => ({
            productId: itemId,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            price: item.new_price,
            total: item.new_price * item.quantity,
            selectedSize: item.selectedSize || 'Standard',
            availableSizes: item.sizes || [],
            keyFeatures: item.keyFeatures || [],
            image: item.image,
            brand: item.brand,
            category: item.category,
            subcategory: item.subcategory,
            stockStatus: item.stockStatus
        }));

        // Remove email from the order payload
        const orderPayload = {
            ...orderData,
            // Email is removed, will be retrieved from auth token on server
            items: enhancedItems,
            orderTotal: totalCartAmount,
            deliveryFee: deliveryFee,
            grandTotal: grandTotal,
            orderDate: new Date().toISOString()
        };

        const response = await fetch(`${API_BASE_URL}/order/placeorder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": authToken,
            },
            body: JSON.stringify(orderPayload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Order placement failed");
        }

        const result = await response.json();

        // Clear cart state directly without using clearCart() which might cause a refresh
        // Update cart state directly in the context
        setCartState(prevState => ({
            ...prevState,
            items: {}
        }));
        
        // Update local storage to match the empty cart
        localStorage.setItem('cart', JSON.stringify({}));
        
        // Refresh orders without page reload
        await getOrders();

        toast.success("Order placed successfully!");
        return result;

    } catch (error) {
        console.error('Order placement error:', error);
        toast.error(error.message);
        throw error;
    } finally {
        setLoading(false);
    }
}, [cartState.items, getTotalCartAmount, getOrders, setCartState]);

    // Unified filter function that handles category, subcategory, brands, and price
        const filterProducts = useCallback(({
        category = null,
        subcategory = null,
        brands = [],
        priceRange = { min: 0, max: Infinity }
           } ) => {
        if (!Array.isArray(all)) {
            setFilteredProducts([]);
            return [];
        }
    
        let filtered = [...all];
    
        try {
            // Apply category filter
            if (category && category !== "shop") {
                filtered = filtered.filter(product => 
                    product?.category && 
                    product.category.toLowerCase() === category.toLowerCase()
                );
            }
    
            // Apply subcategory filter
            if (subcategory) {
                filtered = filtered.filter(product => 
                    product?.subcategory && 
                    product.subcategory.toLowerCase().replace(/ /g, '-') === subcategory.toLowerCase()
                );
            }
    
            // Apply brand filter
            if (Array.isArray(brands) && brands.length > 0) {
                filtered = filtered.filter(product => 
                    product?.brand && 
                    brands.some(brand => 
                        brand && product.brand.toLowerCase() === brand.toLowerCase()
                    )
                );
            }
    
            // Apply price filter
            if (priceRange?.min !== undefined && priceRange?.max !== undefined) {
                filtered = filtered.filter(product => 
                    product?.new_price && 
                    product.new_price >= priceRange.min && 
                    product.new_price <= priceRange.max
                );
            }
    
            setFilteredProducts(filtered);
            return filtered;
        } catch (error) {
            console.error('Error filtering products:', error);
            setFilteredProducts([]);
            return [];
        }
    }, [all, setFilteredProducts]);
    const filterByCategory = useCallback((category) => {
        if (typeof category === 'string') {
            filterProducts({ category });
        }
    }, [filterProducts]);

    const filterBySubcategory = useCallback((subcategory) => {
        if (typeof subcategory === 'string') {
            filterProducts({ subcategory });
        }
    }, [filterProducts]);

    const filterByBrand = useCallback((brand) => {
        if (typeof brand === 'string' || brand === null) {
            filterProducts({ brands: brand ? [brand] : [] });
        }
    }, [filterProducts]);

    // Fetch products by category
    const fetchProductsByCategory = useCallback(async (category, subcategory, limit = 4) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/product/bestproducts/${category}/${subcategory}?limit=${limit}`
            );
            if (!response.ok) throw new Error("Failed to fetch products");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching ${subcategory} ${category}:`, error);
            return [];
        }
    }, []);

    // Brand-specific product fetchers
    const fetchBrandProducts = useCallback(async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}/product/${endpoint}`);
            if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return [];
        }
    }, []);

    const fetchBestVitronTvs = useCallback(() => 
        fetchBrandProducts('bestvitrontvs'), [fetchBrandProducts]);

    const fetchBestOrimoPowerbanks = useCallback(() => 
        fetchBrandProducts('bestpowerbanks'), [fetchBrandProducts]);

    const fetchBestJblSpeakers = useCallback(() => 
        fetchBrandProducts('bestjblspeakers'), [fetchBrandProducts]);

    const fetchBestHpLaptops = useCallback(() => 
        fetchBrandProducts('besthplaptops'), [fetchBrandProducts]);




    const searchProducts = useCallback((searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredProducts(all);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const filtered = all.filter((product) => {
            return (
                (product.id && product.id.toString().includes(searchLower)) ||
                (product.name && product.name.toLowerCase().includes(searchLower)) ||
                (product.category && product.category.toLowerCase().includes(searchLower)) ||
                (product.description && product.description.toLowerCase().includes(searchLower))
            );
        });
        setFilteredProducts(filtered);
    }, [all]);


    


  //Password Management
    const requestPasswordReset = async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reset-password/forgetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send password reset request.');
            }

            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Error in requestPasswordReset:', error);
            return { success: false, error: error.message };
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reset-password/resetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to reset password.');
            }

            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Error in resetPassword:', error);
            return { success: false, error: error.message };
        }
    };
    if (loading) {
        return null; // Or a loading spinner component if you have one
    }

    const contextValue = {
        // Products
        all,
    updateStockStatus,
    filteredProducts,
    searchProducts,
    filterProducts,
    filterByCategory,
    filterBySubcategory,
    filterByBrand,
    fetchProductsByCategory,
    fetchBestVitronTvs,
    fetchBestOrimoPowerbanks,
    fetchBestJblSpeakers,
    fetchBestHpLaptops,
    loading,
    error,
    checkStock,
    checkStocks,
    checkCartStock,

    // Cart
    cartState,
    addToCart,
    removeFromCart,
    cleanupCartOperations,
    clearCart,
    updateCartItemQuantity,
    isItemInCart,
    fetchCartStatus,
    fetchCartData,
    getTotalCartAmount,
    getTotalCartItems,
    setCartState,
    getDefaultCart,
    checkSingleProductStatus,
    updateProductStatus,

    // Orders
    orders,
    placeOrder,
    getOrders,
    validateCart,
    handleUserLogin,


    // Auth
    requestPasswordReset,
    resetPassword
    };
    
    if (loading) {
        return <div>{}</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <shopContext.Provider value={contextValue}>
            {props.children}
        </shopContext.Provider>
    );
};

export default ShopContextProvider;