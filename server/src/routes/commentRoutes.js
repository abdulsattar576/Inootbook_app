import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { deleteComment } from '../controllers/commentController.js';

const router = Router();

router.delete('/:id', requireAuth, deleteComment);

export default router;

