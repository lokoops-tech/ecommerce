import React, { useEffect, useState } from 'react';
import Item from '../item/Item.jsx';
import SEO from '../../pages/Seo.jsx';
import './Popular.css';

const API_BASE_URL = "https://ecommerce-axdj.onrender.com";

const Popular = () => {
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Fetch only earpods with specific brands
        fetch(`${API_BASE_URL}/product/allproducts`)
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);
                
                // Process the data to filter only earpods with specific brands
                let products = [];
                
                if (Array.isArray(data)) {
                    products = data;
                } else if (data && Array.isArray(data.products)) {
                    products = data.products;
                }
                
                // Filter products to only include earpods with specified brands
                const filteredProducts = products.filter(product => 
                    product.category === "earpods" && 
                    ["Orimo", "Xiomi", "Oppo", "Apple", "Samsung", "Huawei", "Sony"].includes(product.brand)
                );
                
                setPopularProducts(filteredProducts);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setPopularProducts([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

   


    return (
        <>
            {/* Use the reusable SEO component */}
            <SEO  />

            <div className="popular">
                <div className="popular-header">
                    <h1>Earpods || Connect To Pure Sound</h1>
                    <hr />
                </div>
                <div className="popular-item">
                    {loading ? (
                        <p>Loading products...</p>
                    ) : popularProducts.length > 0 ? (
                        popularProducts.map((item) => (
                            <Item
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                image={item.image}
                                new_price={item.new_price}
                                old_price={item.old_price}
                            />
                        ))
                    ) : (
                        <p>No earpods found from our premium brands. Please check back later.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Popular;
