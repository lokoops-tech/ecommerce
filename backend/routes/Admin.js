const express = require("express");
const router = express.Router();
const Admin = require("../Models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Middleware to verify admin token
const fetchAdmin = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET || "secret_admin");
        req.admin = data.adminId;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

// Admin Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET || "secret_admin", { expiresIn: "1d" });

        res.json({ success: true, token });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Admin Signup
router.post("/signup", async (req, res) => {
    try {
        const { email, password, phoneNumber } = req.body;

        // Check if maximum admin limit is reached
        const adminCount = await Admin.countDocuments();
        if (adminCount >= 4) {
            return res.status(403).json({ success: false, message: "Maximum of 4 admins reached. No more signups allowed." });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: "Admin email already exists" });
        }

        // Create new admin
        const admin = new Admin({ email, password, phoneNumber });
        await admin.save();

        res.json({ success: true, message: "Admin account created successfully" });
    } catch (error) {
        console.error("Admin signup error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Get Admin Count
router.get("/count", async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();
        res.json({ success: true, count: adminCount });
    } catch (error) {
        console.error("Error fetching admin count:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Get All Admins
router.get("/all", async (req, res) => {
    try {
        const admins = await Admin.find({}, { password: 0 }); // Exclude passwords
        res.json({ success: true, admins });
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Add Admin
router.post("/add", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: "Admin already exists!" });
        }

        // Create new admin
        const newAdmin = new Admin({ email, password });
        await newAdmin.save();

        res.json({ success: true, message: "Admin added successfully!", admin: newAdmin });
    } catch (error) {
        console.error("Error adding admin:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Update Admin
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password } = req.body;

        // Find admin
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found!" });
        }

        // Check if email is already taken
        const emailExists = await Admin.findOne({ email, _id: { $ne: id } });
        if (emailExists) {
            return res.status(400).json({ success: false, message: "Email already in use!" });
        }

        // Update admin details
        admin.email = email;
        if (password) {
            admin.password = password; // Password will be hashed by pre-save hook
        }
        await admin.save();

        res.json({ success: true, message: "Admin updated successfully!", admin });
    } catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Delete Admin
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await Admin.findByIdAndDelete(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found!" });
        }

        res.json({ success: true, message: "Admin deleted successfully!" });
    } catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Update Admin Notifications
router.patch("/notifications/:id", fetchAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { notificationsEnabled } = req.body;

        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found!" });
        }

        admin.notificationsEnabled = notificationsEnabled;
        await admin.save();

        res.json({
            success: true,
            message: `Notifications ${notificationsEnabled ? 'enabled' : 'disabled'} successfully`
        });
    } catch (error) {
        console.error("Error updating notification settings:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Protected Admin Dashboard
router.get("/dashboard", fetchAdmin, async (req, res) => {
    res.json({ success: true, message: "Welcome to the admin dashboard" });
});

// Token Validation
router.get("/validate-token", fetchAdmin, async (req, res) => {
    res.json({ success: true, valid: true });
});

module.exports = router;