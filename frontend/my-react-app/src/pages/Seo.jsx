import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ product = null, category = null, defaultData = {} }) => {
  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('SEO component updated:', {
        productId: product?.id,
        metaTitle: product?.metaTitle || category?.name || defaultData.title,
        timestamp: new Date().toISOString()
      });
    }
  }, [product, category, defaultData]);

  // Dynamically update document title immediately
  useEffect(() => {
    let title = 'Gich-Tech | Electronics & Tech Accessories Store';
    
    if (product) {
      title = product.metaTitle || `${product.name} | Gich-Tech Electronics`;
    } else if (category) {
      title = `${category.name} | Gich-Tech Electronics`;
    } else if (defaultData.title) {
      title = defaultData.title;
    }

    document.title = title;
  }, [product, category, defaultData]);

  // Product SEO
  if (product) {
    // Clean up meta description - remove any code snippets
    const cleanDescription = (product.metaDescription || product.description || '')
      .replace(/\/\/.*?\n/g, '') // Remove code comments
      .replace(/`.*?`/g, '')     // Remove code blocks
      .trim() || `Buy ${product.name} at Gich-Tech Electronics`;

    return (
      <Helmet prioritizeSeoTags>
        <title>{product.metaTitle || `${product.name} | Gich-Tech Electronics`}</title>
        <meta name="description" content={cleanDescription} />
        {product.metaKeywords && <meta name="keywords" content={product.metaKeywords.join(', ')} />}
        
        <link rel="canonical" href={product.seoData?.canonicalUrl || `http://localhost:5173/products/${product.slug || product.id}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.metaTitle || `${product.name} | Gich-Tech Electronics`} />
        <meta property="og:description" content={cleanDescription} />
        <meta property="og:url" content={product.seoData?.canonicalUrl || `http://localhost:5173/products/${product.slug || product.id}`} />
        <meta property="og:image" content={product.images?.[0]?.url || product.image} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.metaTitle || `${product.name} | Gich-Tech Electronics`} />
        <meta name="twitter:description" content={cleanDescription} />
        <meta name="twitter:image" content={product.images?.[0]?.url || product.image} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": cleanDescription,
            "brand": {
              "@type": "Brand",
              "name": product.brand || "Gich-Tech"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": product.currency || "KES",
              "price": product.new_price,
              "availability": product.availability || (product.stockStatus === 'IN_STOCK' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock")
            },
            ...(product.seoData?.structuredData || {})
          })}
        </script>
      </Helmet>
    );
  }

  // Category SEO
  if (category) {
    return (
      <Helmet>
        <title>{`${category.name} | Gich-Tech Electronics`}</title>
        <meta name="description" content={`Shop ${category.name} at Gich-Tech. Find the best ${category.name.toLowerCase()} products and accessories.`} />
        
        <link rel="canonical" href={`http://localhost:5173/${category.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${category.name} | Gich-Tech Electronics`} />
        <meta property="og:description" content={`Shop ${category.name} at Gich-Tech Electronics`} />
        <meta property="og:url" content={`http://localhost:5173/${category.slug}`} />
        <meta property="og:image" content={category.image || 'http://localhost:5173/default-category-image.jpg'} />
      </Helmet>
    );
  }

  // Default SEO
  return (
    <Helmet>
      <title>{defaultData.title || 'Gich-Tech | Electronics & Tech Accessories Store'}</title>
      <meta name="description" content={defaultData.description || 'Premium electronics and tech accessories at Gich-Tech'} />
      
      <link rel="canonical" href={defaultData.canonicalUrl || 'http://localhost:5173'} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={defaultData.title || 'Gich-Tech | Electronics & Tech Accessories Store'} />
      <meta property="og:description" content={defaultData.description || 'Premium electronics and tech accessories at Gich-Tech'} />
      <meta property="og:url" content={defaultData.canonicalUrl || 'http://localhost:5173'} />
      <meta property="og:image" content={defaultData.image || 'http://localhost:5173/og-image.jpg'} />
    </Helmet>
  );
};

export default SEO;