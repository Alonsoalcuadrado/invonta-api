import { Router } from 'express';
import { register, login, refreshToken } from '../controllers/auth';
import { authLimiter } from '../middlewares/rateLimiter';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schemas/auth';

const router = Router();

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  (req, res, next) => register(req, res, next)
);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  (req, res, next) => login(req, res, next)
);

router.post(
  '/refresh-token',
  authLimiter,
  validate(refreshTokenSchema),
  (req, res, next) => refreshToken(req, res, next)
);

export default router; 