const express = require("express");
const router = express.Router();
const Users = require("../Models/User"); // Assuming you have a User model
const Product = require("../Models/Product"); // Assuming you have a Product model
const fetchUser = require("../MiddleWare/Auth"); // Import the authentication middleware
const mongoose = require("mongoose");

// Add to Cart endpoint
router.post("/addtocart", fetchUser, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { itemId, quantity = 1 } = req.body;

        // Find user and product
        const user = await Users.findOne({ _id: req.user.id }).session(session);
        const product = await Product.findOne({ id: itemId }).session(session);

        if (!product) {
            throw new Error("Product not found");
        }

        // Check stock status
        if (product.stockStatus === "OUT_OF_STOCK") {
            return res.status(400).json({
                success: false,
                message: "Product is out of stock"
            });
        }

        // Update cart with product details
        user.cartData[itemId] = {
            quantity,
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
        };

        // Save updated cart
        await Users.updateOne(
            { _id: req.user.id },
            { $set: { [`cartData.${itemId}`]: user.cartData[itemId] } },
            { runValidators: true, session }
        );

        // Commit transaction
        await session.commitTransaction();

        res.json({
            success: true,
            message: "Added to cart",
            cartQuantity: quantity
        });

    } catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        console.error("Add to cart error:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
});

// Remove from Cart endpoint
router.post("/removefromcart", fetchUser, async (req, res) => {
    try {
        const { itemId } = req.body;

        // Find user
        const user = await Users.findOne({ _id: req.user.id });
        if (!user || !user.cartData[itemId]) {
            return res.status(400).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        // Remove item from cart
        delete user.cartData[itemId];
        await user.save();

        res.json({
            success: true,
            message: "Item removed from cart"
        });

    } catch (error) {
        console.error("Remove from cart error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get Cart endpoint
router.post("/getcart", fetchUser, async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            cartData: user.cartData || {}
        });

    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart data"
        });
    }
});

// Update Cart endpoint
router.post("/updatecart", fetchUser, async (req, res) => {
    try {
        const { itemId, quantity, productDetails } = req.body;

        // Find user
        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Validate product
        const product = await Product.findOne({ id: itemId });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check stock status
        if (product.stockStatus === "OUT_OF_STOCK") {
            return res.status(400).json({
                success: false,
                message: "Product is out of stock"
            });
        }

        // Update cart with product details
        user.cartData[itemId] = {
            quantity,
            ...productDetails
        };

        // Save updated cart
        await user.save();

        res.json({
            success: true,
            message: "Cart updated successfully",
            cart: user.cartData,
            updatedItem: {
                id: itemId,
                quantity,
                ...productDetails
            }
        });

    } catch (error) {
        console.error("Cart update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update cart",
            error: error.message
        });
    }
});

// Clear Cart endpoint
router.post("/clearcart", fetchUser, async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Clear cart
        user.cartData = {};
        await user.save();

        res.json({
            success: true,
            message: "Cart cleared successfully"
        });

    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to clear cart",
            error: error.message
        });
    }
});

module.exports = router;