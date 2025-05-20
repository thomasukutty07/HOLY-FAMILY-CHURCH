import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './Database/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import memberRouter from '../server/Routes/memberRoute.js';
import authRouter from '../server/Routes/authRoutes.js';
import familyRouter from '../server/Routes/familyRoute.js';
import groupRouter from '../server/Routes/groupRoute.js';
import calendarRouter from '../server/Routes/calendarRoutes.js';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'CLIENT_URL', 'JWT_SECRET_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 4000;

// CORS Configuration
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    exposedHeaders: ["Set-Cookie"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
    next();
});

// Routes
app.use("/church/auth", authRouter);
app.use("/church/members", memberRouter);
app.use("/church/families", familyRouter);
app.use("/church/groups", groupRouter);
app.use("/church/calendar", calendarRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
function startServer() {
    try {
        connectDb();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        process.exit(1);
    }
}

startServer();