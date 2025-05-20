import jwt from 'jsonwebtoken';
import Auth from '../Models/auth.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Find user in database
            const user = await Auth.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Verify user is an admin
            if (user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Admin privileges required."
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
