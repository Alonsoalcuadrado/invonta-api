import { Router } from 'express';
import { getProfile } from '../controllers/user';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/me', protect, getProfile);

export default router; 