import express from "express"

import { authMiddleware } from "../Middleware/authMiddleware.js"
import { loginUser, logoutUser, forgotPassword, resetPassword, createAdmin } from "../Controllers/authController.js"

const router = express.Router()

// Admin authentication routes
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/create-admin', authMiddleware, createAdmin)

// Protected route to check admin authentication
router.get("/check-auth", authMiddleware, (req, res) => {
    try {
        // Verify user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        res.status(200).json({
            success: true,
            message: "Authorized admin user",
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (error) {
        console.error("Check auth error:", error);
        res.status(500).json({
            success: false,
            message: "Error checking authentication"
        });
    }
});

export default router