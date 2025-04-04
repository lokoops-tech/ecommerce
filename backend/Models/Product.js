const mongoose = require("mongoose");

// Product API endpoint
const ProductSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        default: "No description available"
    },
    shortDescription: {
        type: String,
        maxlength: 160,
        required: true
    },
    metaTitle: {
        type: String,
        maxlength: 60,
        required: true
    },
    metaDescription: {
        type: String,
        maxlength: 160,
        required: true
    },
    metaKeywords: {
        type: [String],
        default: []
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true
        // Will be auto-generated in pre-save middleware if not provided
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    subcategory: {
        type: String,
        required: true,
        index: true
    },
    image: {
        type: String,
        required: true
    },
    images: {
        type: [{
            url: String,
            alt: String,
            type: {
                type: String,
                enum: ['PRIMARY', 'GALLERY', 'THUMBNAIL']
            }
        }],
        default: []
    },
    new_price: {
        type: Number,
        required: true,
        min: 0
    },
    old_price: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'KSH'
    },
    sizes: {
        type: [String],
        default: []
    },
    keyFeatures: {
        type: [String],
        default: []
    },
    technicalSpecs: {
        type: Map,
        of: String,
        default: {}
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    },
    stockStatus: {
        type: String,
        enum: ['IN_STOCK', 'OUT_OF_STOCK'],
        default: 'IN_STOCK',
        index: true
    },
    brand: {
        type: String,
        required: true,
        index: true
    },
    tags: {
        type: [String],
        default: []
    },
    seoData: {
        focusKeyword: String,
        canonicalUrl: String,
        structuredData: String // Will be auto-generated in pre-save middleware
    },
    compatibility: {
        type: [{
            platform: String,  // e.g., "Windows", "macOS", "Android"
            minVersion: String,
            maxVersion: String
        }],
        default: []
    },
    modelInfo: {
        releaseYear: {
            type: Number
        },
        modelNumber: {
            type: String
        },
        series: String,
        generation: String
    },
    warranty: {
        hasCoverage: {
            type: Boolean,
            default: false
        },
        coverageType: {
            type: String,
            enum: ['STANDARD', 'EXTENDED', 'LIMITED', 'LIFETIME', 'MANUFACTURER', 'STORE', 'NONE'],
            default: 'STANDARD'
        },
        durationMonths: {
            type: Number,
            default: 12
        },
        description: String
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    metadata: {
        popularityScore: {
            type: Number,
            default: 0
        }
    },
    availability: {
        type: String,
        enum: ['InStock', 'OutOfStock', 'PreOrder'],
        default: 'InStock'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Enhanced text search - weighted fields
ProductSchema.index({
    name: 'text',
    metaTitle: 'text',
    metaKeywords: 'text',
    description: 'text',
    brand: 'text',
    tags: 'text',
    'modelInfo.modelNumber': 'text',
    'compatibility.platform': 'text',
    'warranty.description': 'text'
}, {
    weights: {
        name: 10,
        metaTitle: 8,
        metaKeywords: 6,
        description: 4,
        brand: 3,
        tags: 2,
        'modelInfo.modelNumber': 5,
        'compatibility.platform': 3,
        'warranty.description': 1
    }
});

// Additional indexes
ProductSchema.index({ 'ratings.average': -1 });
ProductSchema.index({ 'metadata.popularityScore': -1 });
ProductSchema.index({ 'modelInfo.releaseYear': -1 });
ProductSchema.index({ 'warranty.durationMonths': -1 });
ProductSchema.index({ 'warranty.coverageType': 1 });
ProductSchema.index({ 'compatibility.platform': 1 });
ProductSchema.index({ 'modelInfo.modelNumber': 1 });

// Virtual for full URL (SEO friendly URL)
ProductSchema.virtual('url').get(function() {
    return `/products/${this.slug}`;
});

// Method to check if product is in stock
ProductSchema.methods.isInStock = function() {
    return this.stockStatus === 'IN_STOCK';
};

// Method to calculate discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
    if (this.old_price <= this.new_price) return 0;
    return Math.round(((this.old_price - this.new_price) / this.old_price) * 100);
});

// Auto-generate the warranty description if not provided
ProductSchema.pre('validate', function(next) {
    if (this.warranty && this.warranty.hasCoverage && !this.warranty.description) {
        this.warranty.description = `${this.warranty.coverageType.charAt(0) + this.warranty.coverageType.slice(1).toLowerCase()} warranty coverage for ${this.warranty.durationMonths} months`;
    }
    next();
});

// Auto-sync the availability field with stockStatus
ProductSchema.pre('validate', function(next) {
    // Map stockStatus to availability
    if (this.stockStatus === 'IN_STOCK') {
        this.availability = 'InStock';
    } else if (this.stockStatus === 'OUT_OF_STOCK') {
        this.availability = 'OutOfStock';
    }
    next();
});

// Enhanced structured data generation for electronics
ProductSchema.methods.generateStructuredData = function() {
    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": this.name,
        "image": this.images.length > 0 ? this.images.map(img => img.url) : this.image,
        "description": this.description,
        "brand": {
            "@type": "Brand",
            "name": this.brand
        },
        "offers": {
            "@type": "Offer",
            "url": `/products/${this.slug}`,
            "priceCurrency": this.currency,
            "price": this.new_price,
            "availability": `https://schema.org/${this.availability}`,
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
        }
    };

    // Add ratings if available
    if (this.ratings && this.ratings.count > 0) {
        structuredData.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": this.ratings.average.toFixed(1),
            "reviewCount": this.ratings.count
        };
    }

    // Add model number if available
    if (this.modelInfo && this.modelInfo.modelNumber) {
        structuredData.model = this.modelInfo.modelNumber;
    }

    // Add warranty if available
    if (this.warranty && this.warranty.hasCoverage) {
        structuredData.warranty = this.warranty.description;
    }

    return JSON.stringify(structuredData);
};

// Auto-generate canonical URL if not provided
ProductSchema.pre('validate', function(next) {
    if (this.seoData && !this.seoData.canonicalUrl) {
        this.seoData.canonicalUrl = `https://yourstore.com/products/${this.slug}`;
    }
    next();
});

// Auto-generate metaTitle if not provided
ProductSchema.pre('validate', function(next) {
    if (!this.metaTitle) {
        let title = `${this.name} - ${this.brand}`;
        if (title.length > 60) {
            title = title.substring(0, 57) + '...';
        }
        this.metaTitle = title;
    }
    next();
});

// Auto-generate metaDescription if not provided
ProductSchema.pre('validate', function(next) {
    if (!this.metaDescription) {
        let description = this.shortDescription || this.description;
        if (description.length > 160) {
            description = description.substring(0, 157) + '...';
        }
        this.metaDescription = description;
    }
    next();
});

// Auto-generate slug if not provided
ProductSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

// Auto-generate structured data for rich snippets
ProductSchema.pre('save', function(next) {
    if (!this.seoData) {
        this.seoData = {};
    }
    this.seoData.structuredData = this.generateStructuredData();
    next();
});

// Auto-generate focus keyword if not provided
ProductSchema.pre('save', function(next) {
    if (this.seoData && !this.seoData.focusKeyword) {
        // Extract main keywords from product name and category
        const nameWords = this.name.split(' ');
        const mainKeyword = nameWords.length > 1 ? 
            nameWords.slice(0, 2).join(' ') : 
            `${this.brand} ${this.category}`;
        
        this.seoData.focusKeyword = mainKeyword;
    }
    next();
});

// Auto-update popularity score based on views and ratings
ProductSchema.methods.updatePopularityScore = function(views = 0) {
    const ratingWeight = 2;
    const viewWeight = 0.1;
    
    // Calculate score based on ratings and views
    this.metadata.popularityScore = 
        (this.ratings.average * this.ratings.count * ratingWeight) + 
        (views * viewWeight);
    
    return this.save();
};

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;