import { createClient } from 'redis';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

let redisClient = null;

// Only create Redis client if REDIS_URL is set
if (process.env.REDIS_URL) {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 3) {
                        logger.warn('Redis max retries reached. Running without Redis...');
                        return false; // Stop trying to reconnect
                    }
                    return Math.min(retries * 100, 1000);
                }
            }
        });

        redisClient.on('error', (err) => {
            logger.error('Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
            logger.info('Redis Client Connected');
        });

        redisClient.on('reconnecting', () => {
            logger.warn('Redis Client Reconnecting...');
        });
    } catch (error) {
        logger.warn('Redis client creation failed:', error);
        redisClient = null;
    }
} else {
    logger.info('Redis URL not configured. Running without Redis...');
}

export const connectRedis = async () => {
    if (!redisClient) {
        return null;
    }

    try {
        await redisClient.connect();
        return redisClient;
    } catch (error) {
        logger.error('Redis connection failed:', error);
        return null;
    }
};

export const cacheMiddleware = (duration) => {
    return async (req, res, next) => {
        if (!redisClient || !redisClient.isOpen || req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl}`;
        try {
            const cachedResponse = await redisClient.get(key);
            if (cachedResponse) {
                return res.json(JSON.parse(cachedResponse));
            }
        } catch (error) {
            logger.error('Cache error:', error);
        }

        res.originalJson = res.json;
        res.json = async (body) => {
            if (redisClient && redisClient.isOpen) {
                try {
                    await redisClient.setEx(key, duration, JSON.stringify(body));
                } catch (error) {
                    logger.error('Cache set error:', error);
                }
            }
            res.originalJson(body);
        };
        next();
    };
};

export default redisClient; 