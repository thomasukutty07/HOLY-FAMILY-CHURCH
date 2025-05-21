import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from './redis.js';
import logger from './logger.js';

// Memory store as fallback
function createMemoryFallbackStore() {
    const memoryStore = new Map();
    return {
        increment: (key) => {
            const current = memoryStore.get(key) || 0;
            memoryStore.set(key, current + 1);
            return Promise.resolve(current + 1);
        },
        decrement: (key) => {
            const current = memoryStore.get(key) || 0;
            memoryStore.set(key, Math.max(0, current - 1));
            return Promise.resolve();
        },
        resetKey: (key) => {
            memoryStore.delete(key);
            return Promise.resolve();
        }
    };
}

// General API rate limiter
export const apiLimiter = rateLimit({
    store: (redisClient && redisClient.isOpen) ? new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }) : createMemoryFallbackStore(),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth routes rate limiter (more strict)
export const authLimiter = rateLimit({
    store: (redisClient && redisClient.isOpen) ? new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }) : createMemoryFallbackStore(),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 login attempts per hour
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// File upload rate limiter
export const uploadLimiter = rateLimit({
    store: (redisClient && redisClient.isOpen) ? new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }) : createMemoryFallbackStore(),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 uploads per hour
    message: 'Too many file uploads, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
}); 