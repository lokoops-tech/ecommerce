const express = require("express");
const router = express.Router();
const Newsletter = require("../Models/Newsletter"); 
const transporter = require("../Config/Email"); 

// Subscribe to newsletter
router.post("/subscribe", async (req, res) => {
    const { email } = req.body;

    try {
        // Validate email
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ success: false, error: "Invalid email address" });
        }

        // Check for existing subscription
        const existingSubscription = await Newsletter.findOne({ email });
        if (existingSubscription) {
            return res.status(400).json({ success: false, error: "Email already subscribed" });
        }

        // Save new subscription
        const newSubscription = new Newsletter({ email });
        await newSubscription.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to Our Newsletter!",
            html: `
                <h2>Welcome to Our Newsletter!</h2>
                <p>Thank you for subscribing. You'll receive our latest updates and offers.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Successfully subscribed to newsletter!"
        });

    } catch (error) {
        console.error("Newsletter subscription error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to process subscription. Please try again later."
        });
    }
});

// Get all newsletter subscribers (admin endpoint)
router.get("/subscribers", async (req, res) => {
    try {
        const subscribers = await Newsletter.find({})
            .select("email subscribedAt")
            .sort("-subscribedAt");

        res.status(200).json({
            success: true,
            subscribers
        });

    } catch (error) {
        console.error("Error fetching subscribers:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch subscribers"
        });
    }
});

// Unsubscribe from newsletter
router.delete("/unsubscribe", async (req, res) => {
    const { email } = req.body;

    try {
        const result = await Newsletter.findOneAndDelete({ email });
        if (!result) {
            return res.status(404).json({
                success: false,
                error: "Subscription not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Successfully unsubscribed"
        });

    } catch (error) {
        console.error("Error unsubscribing:", error);
        res.status(500).json({
            success: false,
            error: "Failed to process unsubscription"
        });
    }
});

module.exports = router;