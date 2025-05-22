import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/AppError';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again after 15 minutes',
  handler: (req, res) => {
    throw new AppError('Too many login attempts, please try again after 15 minutes', 429);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res) => {
    throw new AppError('Too many requests from this IP, please try again after 15 minutes', 429);
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 