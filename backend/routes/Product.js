const express = require("express");
const router = express.Router();
const Product = require("../Models/Product");
const StockUpdateLog = require("../Models/Stock"); 
const mongoose = require("mongoose");
const Joi = require('joi');




// Define a Joi schema for validation with optional fields that can be auto-generated
const productSchema = Joi.object({
    // Required fields
    name: Joi.string().required(),
    description: Joi.string().required().default("No description available"),
    shortDescription: Joi.string().max(160).required(),
    category: Joi.string().required(),
    subcategory: Joi.string().required(),
    image: Joi.string().required(),
    new_price: Joi.number().required().min(0),
    old_price: Joi.number().required().min(0),
    brand: Joi.string().required(),
    
    // Optional fields - will be auto-generated if not provided
    metaTitle: Joi.string().max(60),
    metaDescription: Joi.string().max(160),
    slug: Joi.string().lowercase().trim(),
    
    // Optional with defaults
    metaKeywords: Joi.array().items(Joi.string()).default([]),
    images: Joi.array().items(
        Joi.object({
            url: Joi.string().required(),
            alt: Joi.string().required(),
            type: Joi.string().valid('PRIMARY', 'GALLERY', 'THUMBNAIL').required()
        })
    ).default([]),
    currency: Joi.string().default('KSH'),
    sizes: Joi.array().items(Joi.string()).default([]),
    colors: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            hexCode: Joi.string().required()
        })
    ).default([]),
    keyFeatures: Joi.array().items(Joi.string()).default([]),
    technicalSpecs: Joi.object().pattern(Joi.string(), Joi.string()).default({}),
    stockStatus: Joi.string().valid('IN_STOCK', 'OUT_OF_STOCK', 'PREORDER', 'BACKORDER').default('IN_STOCK'),
 
    // SEO data - will be auto-generated if not provided
    seoData: Joi.object({
        focusKeyword: Joi.string().allow(''),
        canonicalUrl: Joi.string().allow(''),
        structuredData: Joi.string().allow('')
    }).default({}),
    
    // Warranty - description will be auto-generated if not provided
    warranty: Joi.object({
        hasCoverage: Joi.boolean().default(false),
        durationMonths: Joi.number().min(0),
        coverageType: Joi.string().valid('STANDARD', 'EXTENDED', 'LIMITED', 'LIFETIME',
         'MANUFACTURER', 'STORE', 'NONE').default('STANDARD'),
        description: Joi.string().allow('')
    }).default({ hasCoverage: false }),
    
 
    
    compatibility: Joi.array().items(
        Joi.object({
            platform: Joi.string().required(),
            minVersion: Joi.string().allow(''),
            maxVersion: Joi.string().allow('')
        })
    ).default([]),
    
    modelInfo: Joi.object({
        releaseYear: Joi.number(),
        modelNumber: Joi.string().allow(''),
        series: Joi.string().allow(''),
        generation: Joi.string().allow('')
    }).default({}),
    
    accessories: Joi.object({
        included: Joi.array().items(Joi.string()).default([]),
        recommended: Joi.array().items(Joi.string()).default([])
    }).default({}),
    

});

// Add product endpoint
router.post('/addproduct', async (req, res) => {
    try {
        const { error, value } = productSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details.map(detail => detail.message).join(', ')
            });
        }

        let product;
        let id;
        let retries = 0;

        // Retry logic to handle duplicate IDs
        while (!product && retries < 5) {
            try {
                const products = await Product.find({}).sort({ id: -1 }).limit(1);
                id = products.length > 0 ? products[0].id + 1 : 1;

                const productData = {
                    id,
                    ...value,
                    metadata: {
                        views: 0,
                        sales: 0,
                        lastRestocked: new Date(),
                        popularityScore: 0
                    }
                };

                product = new Product(productData);
                await product.save();
            } catch (err) {
                if (err.code === 11000) { // Duplicate key error
                    retries++;
                    continue;
                }
                throw err;
            }
        }

        if (!product) {
            throw new Error("Failed to generate a unique product ID");
        }

        

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product
        });

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// Get all products
router.get('/allproducts', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Remove a product
router.post('/removeproduct', async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ id: req.body.id });
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product removed successfully',
            name: product.name
        });

    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get products by category and subcategory
router.get('/products/:category/:subcategory', async (req, res) => {
    try {
        const products = await Product.find({
            category: req.params.category,
            subcategory: req.params.subcategory
        });

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get products by category with filters
router.get('/products/:category', async (req, res) => {
    try {
        const { minPrice, maxPrice, sort } = req.query;
        let query = { category: req.params.category };

        // Apply price filters
        if (minPrice || maxPrice) {
            query.new_price = {};
            if (minPrice) query.new_price.$gte = Number(minPrice);
            if (maxPrice) query.new_price.$lte = Number(maxPrice);
        }

        let products = await Product.find(query);

        // Apply sorting
        if (sort) {
            switch (sort) {
                case 'price-asc':
                    products.sort((a, b) => a.new_price - b.new_price);
                    break;
                case 'price-desc':
                    products.sort((a, b) => b.new_price - a.new_price);
                    break;
                case 'newest':
                    products.sort((a, b) => b.date - a.date);
                    break;
            }
        }

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get new collection with subcategories
router.get('/newcollection', async (req, res) => {
    try {
        const products = await Product.find({});

        if (!products || !Array.isArray(products)) {
            return res.status(500).json({
                success: false,
                error: 'Database returned invalid data'
            });
        }

        if (products.length === 0) {
            return res.json([]);
        }

        const categorySubcategories = {};

        products.forEach(product => {
            const key = `${product.category}-${product.subcategory}`;
            if (!categorySubcategories[key]) {
                categorySubcategories[key] = [];
            }
            categorySubcategories[key].push(product);
        });

        const newcollection = Object.values(categorySubcategories).map(products => {
            products.sort((a, b) => {
                const dateA = a.date instanceof Date ? a.date : new Date(a.date || 0);
                const dateB = b.date instanceof Date ? b.date : new Date(b.date || 0);
                return dateB - dateA;
            });
            return products[0];
        });

        res.json({
            success: true,
            count: newcollection.length,
            newcollection
        });

    } catch (error) {
        console.error('Error in /newcollection endpoint:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get best Orimo products
router.get('/bestorimoproducts', async (req, res) => {
    try {
        const products = await Product.find({ category: "earpods", brand: { $in: ["Orimo", "Xiomi", "Oppo", "Apple", "Samsung", "Huawei", "Sony"] } })
            .sort({ rating: -1, reviews: -1 })
            .limit(8);

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Error fetching best Orimo products:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get best Vitron TVs
router.get('/bestvitrontvs', async (req, res) => {
    try {
        const products = await Product.find({
            category: "tv-appliances",
            subcategory: "smart-tvs",
            brand: "Vitron"
        })
        .sort({ rating: -1, reviews: -1 })
        .limit(8);

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Error fetching best Vitron TVs:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get best Orimo powerbanks
router.get('/bestpowerbanks', async (req, res) => {
    try {
        const products = await Product.find({
            category: "phone-accessories",
            subcategory: "power-banks",
            brand: "Orimo"
        })
        .sort({ rating: -1, reviews: -1 })
        .limit(8);

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Error fetching best Orimo powerbanks:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get best JBL speakers
router.get('/bestjblspeakers', async (req, res) => {
    try {
        const products = await Product.find({
            category: "woofers",
            subcategory: "home-theater-systems",
            brand: "Jbl"
        })
        .sort({ rating: -1, reviews: -1 })
        .limit(8);

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Error fetching best JBL speakers:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get best HP laptops
router.get('/besthplaptops', async (req, res) => {
    try {
        const products = await Product.find({
            category: "pc-computer-products",
            subcategory: "laptops",
            brand: "Hp"
        })
        .sort({ rating: -1, reviews: -1 })
        .limit(8);

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Error fetching best HP laptops:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// Bulk update products based on criteria
router.put('/bulkupdate', async (req, res) => {
    try {
        const { criteria, updates, dryRun = false } = req.body;
        
        if (!criteria || !updates) {
            return res.status(400).json({
                success: false,
                error: 'Both criteria and updates are required'
            });
        }
        
        // Validate updates against a subset of the product schema
        // This allows for partial updates instead of requiring all fields
        const updateSchema = Joi.object({
            name: productSchema.extract('name'),
            description: productSchema.extract('description'),
            shortDescription: productSchema.extract('shortDescription'),
            category: productSchema.extract('category'),
            subcategory: productSchema.extract('subcategory'),
            image: productSchema.extract('image'),
            new_price: productSchema.extract('new_price'),
            old_price: productSchema.extract('old_price'),
            brand: productSchema.extract('brand'),
            metaTitle: productSchema.extract('metaTitle'),
            metaDescription: productSchema.extract('metaDescription'),
            slug: productSchema.extract('slug'),
            metaKeywords: productSchema.extract('metaKeywords'),
            images: productSchema.extract('images'),
            currency: productSchema.extract('currency'),
            sizes: productSchema.extract('sizes'),
            colors: productSchema.extract('colors'),
            keyFeatures: productSchema.extract('keyFeatures'),
            technicalSpecs: productSchema.extract('technicalSpecs'),
            stockStatus: productSchema.extract('stockStatus'),
            seoData: productSchema.extract('seoData'),
            warranty: productSchema.extract('warranty'),
            compatibility: productSchema.extract('compatibility'),
            modelInfo: productSchema.extract('modelInfo'),
            accessories: productSchema.extract('accessories')
        }).min(1); // At least one field must be provided for update
        
        const { error, value } = updateSchema.validate(updates, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details.map(detail => detail.message).join(', ')
            });
        }
        
        // Find products matching the criteria
        const matchingProducts = await Product.find(criteria);
        
        if (matchingProducts.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No products match the provided criteria'
            });
        }
        
        if (dryRun) {
            // If it's a dry run, only return products that would be updated
            return res.json({
                success: true,
                message: `${matchingProducts.length} products would be updated`,
                productsToUpdate: matchingProducts.map(p => ({ id: p.id, name: p.name }))
            });
        }
        
        // Perform the actual update
        const result = await Product.updateMany(criteria, { $set: value });
        
        // Log the bulk update
        const updateLog = {
            date: new Date(),
            criteria: JSON.stringify(criteria),
            updates: JSON.stringify(value),
            productsAffected: result.modifiedCount
        };
        
        res.json({
            success: true,
            message: `Successfully updated ${result.modifiedCount} products`,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            updateLog
        });
    } catch (error) {
        console.error("Error performing bulk update:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// Update a product (edit all fields)
router.put('/updateproduct/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const existingProduct = await Product.findOne({ id: productId });
        
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Remove restricted fields from the update data
        const updateData = { ...req.body };
        const restrictedFields = [
            'images[0]._id', 'images[0].id', 'ratings', 'metadata', '_id', 
            'id', 'tags', 'availability', 'date', 'createdAt', 
            'updatedAt', '__v', 'url', 'discountPercentage'
        ];
        
        restrictedFields.forEach(field => {
            if (field.includes('[')) {
                // Handle nested fields like 'images[0]._id'
                const [arrayName, indexAndProp] = field.split('[');
                const [index, prop] = indexAndProp.split('].');
                
                if (updateData[arrayName] && updateData[arrayName][parseInt(index)]) {
                    delete updateData[arrayName][parseInt(index)][prop];
                }
            } else {
                delete updateData[field];
            }
        });

        // Validate the cleaned request body
        const { error, value } = productSchema.validate(updateData, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details.map(detail => detail.message).join(', ')
            });
        }

        // Update the product with validated and filtered data
        const updatedProduct = await Product.findOneAndUpdate(
            { id: productId },
            { $set: value },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;