import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { listUsers, usersCount } from '../controllers/userController.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, listUsers);
router.get('/count', requireAuth, requireAdmin, usersCount);

export default router;

