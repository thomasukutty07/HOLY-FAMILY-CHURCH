import express from "express"

import { authMiddleware } from "../Middleware/authMiddleware.js"
import { loginUser, logoutUser, registerUser } from "../Controllers/authController.js"

const router = express.Router()


router.post('/login', loginUser)
router.post('/register', registerUser)
router.post('/logout', logoutUser)
//  Protected route to check authentication
router.get("/check-auth", authMiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: "Authorized user",
        user
    });
});
export default router