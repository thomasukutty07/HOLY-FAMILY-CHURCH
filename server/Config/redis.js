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

// Redis is disabled
logger.info('Redis is disabled in this configuration');

export const connectRedis = async () => {
    logger.info('Redis connection skipped - Redis is disabled');
    return null;
};

export const cacheMiddleware = (duration) => {
    return async (req, res, next) => {
        // Skip caching when Redis is disabled
        return next();
    };
};

export default null;
