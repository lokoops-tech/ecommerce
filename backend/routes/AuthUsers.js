const express = require("express");
const router = express.Router();
const Users = require("../Models/User"); // Assuming you have a User model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup endpoint
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Username, email, and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new Users({
            username,
            email,
            password: hashedPassword,
            cartData: {} // Initialize empty cart
        });

        // Save user to database
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            token
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Login endpoint
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await Users.findOne({ email });
        if (!user) {
            // Use a dummy hash to prevent timing attacks
            await bcrypt.compare(password, "$2b$10$dummyhashdummyhashdummyhasdummyha");
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Check account status (optional)
        if (user.accountStatus === "locked") {
            return res.status(403).json({
                success: false,
                message: "Account is locked. Please contact support."
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign({ user: { id: user._id, email: user.email } }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

module.exports = router;