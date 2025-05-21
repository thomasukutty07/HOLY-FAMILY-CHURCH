import express from 'express';
import dotenv from 'dotenv';
import { requestLogger, errorLogger, default as logger } from './Config/logger.js';
import { connectDb } from './Database/db.js';
import { connectRedis } from './Config/redis.js';
import { apiLimiter, authLimiter } from './Config/rateLimit.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import memberRouter from './Routes/memberRoute.js';
import authRouter from './Routes/authRoutes.js';
import familyRouter from './Routes/familyRoute.js';
import groupRouter from './Routes/groupRoute.js';
import calendarRouter from './Routes/calendarRoutes.js';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'CLIENT_URL', 'JWT_SECRET_KEY', 'MONGO_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    logger.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

// Optional Redis configuration
if (!process.env.REDIS_URL) {
    logger.warn('REDIS_URL not set. Running without Redis caching...');
}

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    exposedHeaders: ["Set-Cookie"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Compression middleware
app.use(compression());

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use(requestLogger);

// Rate limiting
app.use('/church/auth', authLimiter);
app.use('/church', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        redis: process.env.REDIS_URL ? 'configured' : 'not configured'
    });
});

// Routes
app.use("/church/auth", authRouter);
app.use("/church/members", memberRouter);
app.use("/church/families", familyRouter);
app.use("/church/groups", groupRouter);
app.use("/church/calendar", calendarRouter);

// Error handling middleware
app.use(errorLogger);
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
async function startServer() {
    try {
        await connectDb();
        const redis = await connectRedis();
        
        if (!redis) {
            logger.warn('Redis connection failed. Running without caching...');
        }
        
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

startServer();