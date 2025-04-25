
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
        const allowedOrigins = ["https://eco-pirg.onrender.com", "https://ecommerce-3-93bn.onrender.com"];
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
const uploadDir = './upload/images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}



// Image storage configuration
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Serving static images
app.use('/images', express.static('upload/images'));

// API root endpoint
app.get("/", (req, res) => {
    res.send("Express App is running");
});

// Upload endpoint for images
app.post("/upload", upload.single('product'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No file uploaded"
            });
        }
        res.json({
            success: true,
            image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
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
