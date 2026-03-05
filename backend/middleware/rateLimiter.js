import rateLimit from 'express-rate-limit';

// Environment-based configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 100, // Higher limit in development
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDevelopment, // Skip rate limiting in development
});

// Limiter for resume upload (AI processing is expensive)
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDevelopment ? 1000 : 20, // 1000 in dev, 20 in production per hour
  message: {
    success: false,
    error: 'Too many resume uploads, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDevelopment, // Skip rate limiting in development
});

// Auth routes limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 100 : 10, // Higher limit in development
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDevelopment, // Skip rate limiting in development
});
