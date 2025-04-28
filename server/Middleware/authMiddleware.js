import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "Unauthorized user."
        });
    }
};
