const jwt = require("jsonwebtoken");
const Users = require("../Models/User"); 

// Authentication middleware to verify JWT token
const fetchUser = async (req, res, next) => {
    try {
        // Check for token in Authorization header or custom header
        const token = req.header("Authorization")?.split(" ")[1] || req.header("auth-token");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please authenticate using a valid token"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "test_secret");

        // Extract user ID from token
        const userId = decoded.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            });
        }

        // Find user in database
        const user = await Users.findById(userId, { password: 0 }); // Exclude password
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found with token ID"
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication middleware error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid token, authentication failed"
        });
    }
};

module.exports = fetchUser;