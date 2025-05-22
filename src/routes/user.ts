import { Router } from 'express';
import { getMe } from '../controllers/user';
import { authenticate } from '../middlewares/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();

router.get('/me', 
  async (req, res, next) => {
    await authenticate(req as AuthenticatedRequest, res, next);
  },
  async (req, res) => {
    await getMe(req as AuthenticatedRequest, res);
  }
);

export default router; 