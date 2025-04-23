import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import { useParams } from "react-router-dom";
import BreadCrum from "../components/Breadcrums/Breadcrum";
import Describe from "../components/Descriptionbox/DescriptionBox";
import ProductDisplay from "../components/productDisplay/productDisplay";
import RelatedProduct from "./relatedProducts";
import YouMayLike from "./YouMayLike";

import RecentlyViewedItems from "./RecentViewed";

const Product = () => {
    const { all, loading, error } = useContext(shopContext);
    const { productName } = useParams();
    const [product, setProduct] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (all?.length) {
            const urlParts = productName.split('-');
            console.log(urlParts);
            const id = parseInt(urlParts[urlParts.length - 1], 10);
            console.log(id);
            const foundProduct = all.find((e) => Number(e.id) === id);
            
            setProduct(foundProduct);
            setIsInitialLoad(false);
        }
    }, [all, productName]);

    if (loading || isInitialLoad) {
        return (
            <div className="loading-container">
                <SEO defaultData={{
                    title: "Loading Product...",
                    description: "Please wait while we load the product details"
                }} />
                <div className="loading-spinner"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <SEO defaultData={{
                    title: "Error Loading Product",
                    description: "We encountered an error while loading the product"
                }} />
                <p>Error loading product: {error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="not-found">
                <SEO defaultData={{
                    title: "Product Not Found",
                    description: "The product you are looking for does not exist"
                }} />
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist.</p>
            </div>
        );
    }

    return (
        <div className="product-page">
            {/* Only render SEO when product is fully loaded */}
            <SEO product={{
                ...product,
                metaTitle: `${product.name} | Gich-Tech Electronics`,
                metaDescription: product.description || `Buy ${product.name} at Gich-Tech Electronics`,
                metaKeywords: [
                    product.name, 
                    product.category, 
                    ...(product.keyFeatures || [])
                ],
                seoData: {
                    canonicalUrl: `http://localhost:5173/products/${product.slug || product.id}`,
                    structuredData: {
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": product.name,
                        "description": product.description,
                        "brand": product.brand || "Gich-Tech",
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "KES",
                            "price": product.new_price,
                            "availability": product.stockStatus === 'IN_STOCK' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                        }
                    }
                }
            }} />
            
            <BreadCrum product={product} />
            <ProductDisplay product={product} />
            <YouMayLike />
            <RecentlyViewedItems />
            <Describe />
        </div>
    );
};

export default Product;
