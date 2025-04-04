const express = require("express");
const router = express.Router();
const Product = require("../Models/Product"); // Assuming you have a Product model
const StockUpdateLog = require("../Models/Stock"); // Assuming you have a StockUpdateLog model
const mongoose = require("mongoose");
// Update product stock

// Update product stock status
router.patch("/product/:id/stock", async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { stockStatus, updatedBy } = req.body;

        // Validate stock status
        if (!["IN_STOCK", "OUT_OF_STOCK"].includes(stockStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid stock status. Must be IN_STOCK or OUT_OF_STOCK"
            });
        }

        // Find product by ID
        const product = await Product.findOne({ id: req.params.id }).session(session);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Ensure previousStatus is always a valid enum value
        const previousStatus = ["IN_STOCK", "OUT_OF_STOCK"].includes(product.stockStatus) 
            ? product.stockStatus 
            : "OUT_OF_STOCK"; // Default to OUT_OF_STOCK if not set

        // Create stock update log with validated values
        await StockUpdateLog.create([{
            productId: product._id,
            previousStatus: previousStatus,
            newStatus: stockStatus,
            updatedBy: updatedBy || "system",
            timestamp: new Date()
        }], { session });

        // Update product stock status
        product.stockStatus = stockStatus;
        await product.save({ session });

        // Commit the transaction
        await session.commitTransaction();

        res.json({
            success: true,
            message: "Stock status updated successfully",
            product: {
                id: product.id,
                name: product.name,
                stockStatus: product.stockStatus,
                updatedAt: product.updatedAt
            }
        });

    } catch (error) {
        // Abort the transaction on error
        await session.abortTransaction();
        console.error("Stock update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update stock status",
            error: error.message
        });
    } finally {
        session.endSession();
    }
});

// Get stock status for a single product
router.get("/product/:id/stock", async (req, res) => {
    try {
        const product = await Product.findOne(
            { id: req.params.id },
            { id: 1, name: 1, stockStatus: 1 }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            product: {
                id: product.id,
                name: product.name,
                stockStatus: product.stockStatus
            }
        });

    } catch (error) {
        console.error("Error fetching product stock status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product stock status",
            error: error.message
        });
    }
});

// Get stock status for all products
router.get("/products/stock", async (req, res) => {
    try {
        const products = await Product.find(
            {},
            { id: 1, name: 1, stockStatus: 1 }
        );

        res.json({
            success: true,
            products: products.map(product => ({
                id: product.id,
                name: product.name,
                stockStatus: product.stockStatus
            }))
        });

    } catch (error) {
        console.error("Error fetching all products stock status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch all products stock status",
            error: error.message
        });
    }
});

// Get stock status with additional details (e.g., last updated timestamp)
router.get("/getstatus", async (req, res) => {
    try {
        const products = await Product.find(
            {},
            { id: 1, name: 1, stockStatus: 1, updatedAt: 1 }
        ).sort({ updatedAt: -1 }); // Sort by most recently updated

        res.json({
            success: true,
            data: {
                products: products.map(product => ({
                    id: product.id,
                    name: product.name,
                    stockStatus: product.stockStatus,
                    lastUpdated: product.updatedAt
                })),
                total: products.length,
                timestamp: new Date()
            }
        });

    } catch (error) {
        console.error("Error fetching stock status with details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stock status with details",
            error: error.message
        });
    }
});

// Get stock status for a single product with additional details
router.get("/getstatus/:id", async (req, res) => {
    try {
        const product = await Product.findOne(
            { id: req.params.id },
            { id: 1, name: 1, stockStatus: 1, updatedAt: 1 }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            data: {
                id: product.id,
                name: product.name,
                stockStatus: product.stockStatus,
                lastUpdated: product.updatedAt
            }
        });

    } catch (error) {
        console.error("Error fetching product stock status with details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product stock status with details",
            error: error.message
        });
    }
});

// Fetch stock status for multiple products
router.post("/products/status", async (req, res) => {
    try {
        const { itemIds } = req.body;

        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing item IDs"
            });
        }

        // Find products by IDs and return their stock status
        const products = await Product.find(
            { id: { $in: itemIds } },
            { id: 1, stockStatus: 1 }
        );

        // Convert to expected format
        const statusData = products.reduce((acc, product) => {
            acc[product.id] = product.stockStatus || "OUT_OF_STOCK";
            return acc;
        }, {});

        res.json({
            success: true,
            statusData
        });

    } catch (error) {
        console.error("Error fetching stock status for multiple products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stock status for multiple products",
            error: error.message
        });
    }
});

module.exports = router;