
const port = process.env.PORT || 4000; 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require('fs');
require("dotenv").config(); // Load environment variables
app.use(express.json());
const cloudinary = require('cloudinary').v2;


// Import routes
const authUsersRoutes = require("./routes/authUsers");
const productRoutes = require("./routes/Product");
const orderRoutes = require("./routes/order");
const adminRoutes = require("./routes/Admin");
const newslettersRoutes = require("./routes/newsletters");
const stockUpdateRoutes = require("./routes/stockUpdate");
const cartRoutes = require("./routes/cart");
const resetPasswordRoutes = require("./routes/resetPassword");
const Analytics = require("./routes/Analytics");



// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = ["https://gich-tech-acssories.onrender.com", "https://ecommerce-3-93bn.onrender.com", "https://eco-pirg.onrender.com"];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit the process if MongoDB connection fails
    });

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, 'upload/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Image storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, 'upload/images'));
    },
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Assuming 'app' is your Express application
// If this is in a separate file, you'll need to export these functions or integrate them appropriately

// Serving static images with absolute path
app.use('/images', express.static(path.join(__dirname, 'upload/images')));


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Upload endpoint for images
app.post("/upload", upload.single('product'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No file uploaded"
            });
        }
        
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        
        // Return the Cloudinary URL
        res.json({
            success: true,
            image_url: result.secure_url
        });
        
        // Optionally delete the local file after upload
        fs.unlinkSync(req.file.path);
        
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Register Routes
app.use("/auth", authUsersRoutes); // Authentication routes (signup, login, etc.)
app.use("/product", productRoutes); // Product-related routes
app.use("/order", orderRoutes); // Order-related routes
app.use("/admin", adminRoutes); // Admin-related routes
app.use("/newsletter", newslettersRoutes); // Newsletter-related routes
app.use("/stockUpdate", stockUpdateRoutes); // Stock-related routes
app.use("/cart", cartRoutes); // Cart-related routes
app.use("/reset-password", resetPasswordRoutes);
app.use("/analytics", Analytics);



// Start Server

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
