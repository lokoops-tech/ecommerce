const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const transporter = require("../Config/Email"); 

// Generate 6-digit reset code
const generateResetCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Forget Password Route
router.post("/forgetpassword", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User with this email does not exist."
            });
        }

        // Generate 6-digit reset code
        const resetCode = generateResetCode();

        // Save code in DB with 15-minute expiration
        user.resetCode = resetCode;
        user.resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // Send reset code email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Code",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Code</h2>
                    <p>Your password reset code is:</p>
                    <h1 style="font-size: 32px; letter-spacing: 5px; color: #4CAF50;">${resetCode}</h1>
                    <p>This code will expire in 15 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Reset code sent to your email."
        });

    } catch (error) {
        console.error("Error in /forgetpassword:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error."
        });
    }
});

// Reset Password Route
router.post("/resetpassword", async (req, res) => {
    const { code, newPassword, email } = req.body;

    try {
        // Find user with valid reset code
        const user = await User.findOne({
            email,
            resetCode: code,
            resetCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Invalid or expired code."
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password and clear the reset code
        user.password = hashedPassword;
        user.resetCode = null;
        user.resetCodeExpires = null;
        await user.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Successful",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Successful</h2>
                    <p>Your password has been successfully reset.</p>
                    <p>If you didn't make this change, please contact support immediately.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Password reset successful."
        });

    } catch (error) {
        console.error("Error in /resetpassword:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error."
        });
    }
});

module.exports = router;
