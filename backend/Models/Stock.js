const mongoose = require("mongoose");

const stockUpdateLogSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    previousStatus: {
        type: String,
        enum: ['IN_STOCK', 'OUT_OF_STOCK'],
        required: true
    },
    newStatus: {
        type: String,
        enum: ['IN_STOCK', 'OUT_OF_STOCK'],
        required: true
    },
    updatedBy: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const StockUpdateLog = mongoose.model('StockUpdateLog', stockUpdateLogSchema);

module.exports= StockUpdateLog;