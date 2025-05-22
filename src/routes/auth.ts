import { Router } from 'express';
import { register, login, refreshToken } from '../controllers/auth';

const router = Router();

router.post('/register', (req, res, next) => register(req, res, next));
router.post('/login', (req, res, next) => login(req, res, next));
router.post('/refresh-token', (req, res, next) => refreshToken(req, res, next));

export default router; 