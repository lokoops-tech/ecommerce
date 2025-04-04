const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    county: {
        type: String,
        required: true
    },
    selectedStage: {
        type: String,
        required: true
    },
    selectedPickup: {
        type: String,
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    orderNotes: {
        type: String,
        default: ""
    },
    items: [{
        productId: String,
        name: String,
        description: String,
        quantity: Number,
        price: Number,
        total: Number,
        // New fields for enhanced product details
        selectedSize: {
            type: String,
            default: 'Standard'
        },
        availableSizes: [{
            type: String
        }],
        keyFeatures: [{
            type: String
        }],
        image: String,
        dateAdded: {
            type: Date,
            default: Date.now
        }
    }],
    orderTotal: {
        type: Number,
        required: true
    },
    grandTotal: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['awaiting_payment', 'paid', 'failed', 'refunded'],
        default: 'awaiting_payment'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add a pre-save middleware to update the updatedAt field
orderSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;