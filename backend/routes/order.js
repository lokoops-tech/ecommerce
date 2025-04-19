const express = require("express");
const router = express.Router();
const Order = require("../Models/Order"); 
const Product = require("../Models/Product"); 
const authMiddleware = require("../MiddleWare/Auth")
const mongoose = require("mongoose")
const transporter = require("../Config/Email"); 

// Place an order
router.post("/placeorder", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validate required fields
        const requiredFields = ["name", "email", "phone", "county", "selectedStage", "selectedPickup", "items"];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        // Generate the next order ID
        const highestOrder = await Order.findOne({}, { orderId: 1 })
            .sort({ orderId: -1 })
            .limit(1)
            .session(session);

        let orderNumber = "001"; // Default if no orders exist
        if (highestOrder) {
            const currentHighest = highestOrder.orderId.replace("GT", "");
            const nextNumber = (parseInt(currentHighest, 10) + 1);
            orderNumber = String(nextNumber).padStart(3, "0");
        }

        const orderId = `GT${orderNumber}`;

        // Map items with product details
        const itemsWithDetails = await Promise.all(
            req.body.items.map(async (item) => {
                const product = await Product.findOne({ id: item.productId }).session(session);
                return {
                    productId: item.productId,
                    name: product ? product.name : "Unknown Product",
                    description: product ? product.description : "No description available",
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total,
                    selectedSize: item.selectedSize || "Standard",
                    availableSizes: product ? product.sizes || [] : [],
                    keyFeatures: product ? product.keyFeatures || [] : [],
                    image: product ? product.image : null,
                    brand: product ? product.brand : null,
                    category: product ? product.category : null,
                    subcategory: product ? product.subcategory : null,
                    dateAdded: new Date()
                };
            })
        );

        // Calculate totals
        const orderTotal = itemsWithDetails.reduce((acc, item) => acc + item.total, 0);
        const deliveryFee = req.body.deliveryFee || 0;
        const grandTotal = orderTotal + deliveryFee;

        // Create the order
        const order = new Order({
            orderId,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            county: req.body.county,
            selectedStage: req.body.selectedStage,
            selectedPickup: req.body.selectedPickup,
            deliveryFee,
            orderNotes: req.body.orderNotes || "",
            items: itemsWithDetails,
            orderTotal,
            grandTotal,
            status: "pending",
            paymentStatus: "awaiting_payment"
        });

        // Save the order
        await order.save({ session });

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: order.email,
            subject: `Order Confirmation - ${order.orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Thank you for your order!</h2>
                    <p>Dear ${order.name},</p>
                    <p>Your order Id ${order.orderId} has been received and is being processed.</p>
                    
                    <h3>Order Details:</h3>
                    <p>Delivery Location: ${order.county}, ${order.selectedStage}</p>
                    <p>Pickup Point: ${order.selectedPickup}</p>
                    ${order.orderNotes ? `<p>Additional Notes: ${order.orderNotes}</p>` : ""}
                    
                    <h3>Order Summary:</h3>
                    <ul>
                        ${order.items.map(item => `
                            <li>
                                <strong>${item.name}</strong><br>
                                ${item.description}<br>
                                Quantity: ${item.quantity} - KSH ${item.price}
                            </li>
                        `).join("")}
                    </ul>
                    
                    <p>Subtotal: KSH ${order.orderTotal}</p>
                    <p>Delivery Fee: KSH ${order.deliveryFee}</p>
                    <p>Total Amount: KSH ${order.grandTotal}</p>
                    
                    <p>Track your order at: <a href="${process.env.DOMAIN_URL || "http://localhost:5173"}/orders/${order.orderId}">${process.env.DOMAIN_URL || "http://localhost:5173"}/orders/${order.orderId}</a></p>
                    
                    <p>Best regards,<br>Gich-Tech</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        // Commit the transaction
        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId: orderId
        });
    } catch (error) {
        // Abort the transaction on error
        await session.abortTransaction();
        console.error("Order placement error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message
        });
    } finally {
        session.endSession();
    }
});
//getorders endpoint
router.get("/getorders", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build the query
        const query = {};
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Fetch orders with pagination
        const orders = await Order.find(query)
            .select({
                orderId: 1,
                name: 1,
                email: 1,
                phone: 1,
                county: 1,
                selectedStage: 1,
                selectedPickup: 1,
                orderNotes: 1,
                items: 1,
                orderTotal: 1,
                deliveryFee: 1,
                grandTotal: 1,
                status: 1,
                createdAt: 1
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await Order.countDocuments(query);

        // Calculate statistics
        const totalRevenue = await Order.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$grandTotal" } } }
        ]);

        const pendingOrders = await Order.countDocuments({ ...query, status: "pending" });

        res.json({
            success: true,
            orders: orders.map(order => ({
                ...order._doc,
                id: order.orderId,
                orderDate: order.createdAt.toLocaleDateString(),
                orderTime: order.createdAt.toLocaleTimeString(),
                itemCount: order.items.reduce((acc, item) => acc + item.quantity, 0),
                orderNotes: order.orderNotes || "",
                items: order.items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    description: item.description,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total,
                    selectedSize: item.selectedSize,
                    availableSizes: item.availableSizes,
                    keyFeatures: item.keyFeatures,
                    image: item.image,
                    brand: item.brand,
                    category: item.category,
                    subcategory: item.subcategory
                }))
            })),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalOrders: total,
                ordersPerPage: limit
            },
            statistics: {
                totalRevenue: totalRevenue[0]?.total || 0,
                pendingOrders,
                averageOrderValue: totalRevenue[0] ? (totalRevenue[0].total / total).toFixed(2) : 0
            }
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
});
router.get("/user-orders", authMiddleware, async (req, res) => {
    try {
        const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

        // Build the query
        const query = { email: req.user.email };
        if (status && status !== "all") {
            query.status = status;
        }
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Fetch orders with pagination
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalOrders = await Order.countDocuments(query);

        res.json({
            success: true,
            orders: orders.map(order => ({
                ...order._doc,
                orderNotes: order.orderNotes || "",
                items: order.items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    description: item.description,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total,
                    selectedSize: item.selectedSize,
                    availableSizes: item.availableSizes,
                    keyFeatures: item.keyFeatures,
                    image: item.image
                }))
            })),
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders
            },
            statistics: {
                totalOrders,
                pendingOrders: await Order.countDocuments({ ...query, status: "pending" }),
                processingOrders: await Order.countDocuments({ ...query, status: "processing" }),
                deliveredOrders: await Order.countDocuments({ ...query, status: "delivered" })
            }
        });
    } catch (error) {
        console.error("Error in /user-orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user orders",
            error: error.message
        });
    }
});

// Update order status (admin endpoint)
router.patch("/update-order-status/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, notes } = req.body;

        // Validate status value
        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        // Find order by orderId
        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Skip update if status is the same
        if (order.status === status) {
            return res.json({
                success: true,
                message: `Order status is already ${status}`,
                order
            });
        }

        // Record previous status for notification
        const previousStatus = order.status;

        // Update order status
        order.status = status;

        // Add admin notes if provided
        if (notes) {
            order.adminNotes = order.adminNotes || [];
            order.adminNotes.push({
                content: notes,
                updatedBy: req.user?.username || "Admin",
                timestamp: new Date(),
                fromStatus: previousStatus,
                toStatus: status
            });
        }

        // Update payment status if order is delivered
        if (status === "delivered" && order.paymentStatus === "awaiting_payment") {
            order.paymentStatus = "paid";
        }

        // Save the updated order
        await order.save();

        // Prepare email notification
        let emailSubject = `Order ${orderId} Status Updated to ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        let statusSpecificMessage = "";

        // Customize email message based on status
        switch (status) {
            case "processing":
                statusSpecificMessage = "We are now processing your order and will prepare it for shipping soon.";
                break;
            case "shipped":
                statusSpecificMessage = "Your order has been shipped and is on its way to you!";
                break;
            case "delivered":
                statusSpecificMessage = "Your order has been delivered. We hope you enjoy your purchase!";
                break;
            case "cancelled":
                emailSubject = `Order ${orderId} has been cancelled`;
                statusSpecificMessage = "Your order has been cancelled. If you didn't request this cancellation, please contact our customer support.";
                break;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: order.email,
            subject: emailSubject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4a4a4a;">Order Status Update</h2>
                    <p>Dear ${order.name},</p>
                    <p>Your order <strong>${orderId}</strong> has been updated to: <span style="color: #2c7be5; font-weight: bold; text-transform: capitalize;">${status}</span></p>
                    
                    <p>${statusSpecificMessage}</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <h3 style="margin-top: 0; color: #4a4a4a;">Order Summary</h3>
                        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total Amount:</strong> KSH ${order.grandTotal}</p>
                        <p><strong>Items:</strong> ${order.items.reduce((acc, item) => acc + item.quantity, 0)}</p>
                    </div>
                    
                    <p>To view complete order details, <a href="${process.env.DOMAIN_URL || "http://localhost:5173"}/orders/${orderId}" style="color: #2c7be5; text-decoration: none; font-weight: bold;">track your order here</a>.</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="margin-bottom: 5px;">Best regards,</p>
                        <p style="margin-top: 0; font-weight: bold;">Gich-Tech Team</p>
                    </div>
                </div>
            `
        };

        // Send email notification
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Order status update email sent to ${order.email}`);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            // Continue despite email failure
        }

        // Send success response
        res.json({
            success: true,
            message: "Order status updated successfully",
            order: {
                ...order.toObject(),
                statusHistory: order.adminNotes || []
            }
        });

    } catch (error) {
        console.error("Status update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });
    }
});
// User update order status
router.patch("/user-update-order-status/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate status value (only allow cancellation for users)
        if (status !== "cancelled") {
            return res.status(400).json({
                success: false,
                message: "You can only cancel orders."
            });
        }

        // Find order by orderId
        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Update order status
        order.status = status;
        await order.save();

        res.json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error("User status update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });
    }
});
// Delete an order
router.delete("/delete/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order first to check if it exists
        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Delete the order
        await Order.deleteOne({ orderId });

        res.json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (error) {
        console.error("Order deletion error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete order",
            error: error.message
        });
    }
});

module.exports = router;
