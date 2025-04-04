// config.js

// Base URL for the API
const API_BASE_URL = 'http://localhost:4000';

// Endpoints
const UPLOAD_IMAGE_URL = `${API_BASE_URL}/upload`; // Endpoint for uploading images
const ADD_PRODUCT_URL = `${API_BASE_URL}/product/addproduct`; // Endpoint for adding a product
const REMOVE_PRODUCT_URL = `${API_BASE_URL}/product/removeproduct`; // Endpoint for removing a product
const PRODUCT_URL = `${API_BASE_URL}/product/admin/products`; //products
const ALL_PRODUCTS = `${API_BASE_URL}/product/allproducts`; //products
const Email_Subscribers=`${API_BASE_URL}/newsletter/subscribers` // email subsrcibers
const UPDATE_PRODUCT_URL = `${API_BASE_URL}/product/updateproduct`; //products 

// Export the URLs
export {
    API_BASE_URL,
    UPLOAD_IMAGE_URL,
    ADD_PRODUCT_URL,
    REMOVE_PRODUCT_URL,
    PRODUCT_URL,
    ALL_PRODUCTS,
    Email_Subscribers,
    UPDATE_PRODUCT_URL,
    



};