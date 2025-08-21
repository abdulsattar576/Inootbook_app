import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  createArticle,
  updateArticle,
  deleteArticle,
  listArticles,
  getArticle,
  toggleLike,
  addComment,
  analyticsSummary,
} from '../controllers/articleController.js';

const router = Router();

router.get('/', listArticles);
router.get('/analytics/summary', analyticsSummary);
router.get('/:id', getArticle);

router.post('/', requireAuth, requireAdmin, createArticle);
router.put('/:id', requireAuth, requireAdmin, updateArticle);
router.delete('/:id', requireAuth, requireAdmin, deleteArticle);

router.post('/:id/like', requireAuth, toggleLike);
router.post('/:id/comment', requireAuth, addComment);

export default router;

