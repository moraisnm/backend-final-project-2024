import express from 'express';
import CommentController from '../controllers/commentController.js';
import { checkAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/movies/:movieId/comments', (req, res, next) => {
  console.log('Comment route hit. MovieId:', req.params.movieId);
  console.log('Request body:', req.body);
  next();
}, checkAuth, CommentController.addComment);

router.get('/movies/:id/comments', CommentController.getCommentsForMovie);
router.put('/movies/:movieId/comments/:commentId', checkAuth, CommentController.updateComment);
router.delete('/movies/:movieId/comments/:commentId', checkAuth, CommentController.deleteComment);

export default router;