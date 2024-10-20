import { Request, Response } from 'express';
import CommentService from '../services/commentService.js';

class CommentController {
  async addComment(req: Request, res: Response) {
    try {
      console.log('Request body:', req.body);
      console.log('Request params:', req.params);
      console.log('Request user:', req.user);
  
      const { movieId } = req.params;
      const { content, rating } = req.body;
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      const userId = req.user.id;
  
      if (!movieId || !content || rating === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const comment = await CommentService.addComment(userId, movieId, content, rating);
      res.status(201).json({ message: 'Comment added', comment });  
    } catch (error: unknown) {
      console.error('Failed to add comment:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: 'Failed to add comment', details: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getCommentsForMovie(req: Request, res: Response) {
    console.log('getCommentsForMovie called');
    console.log('Request params:', req.params);
    console.log('Request query:', req.query);
    console.log('Request user:', req.user);

    try {
      const { id: movieId } = req.params;
      if (!movieId) {
        console.log('Movie ID is missing');
        return res.status(400).json({ error: 'Movie ID is required' });
      }
      console.log('Fetching comments for movie ID:', movieId);
      const comments = await CommentService.getCommentsForMovie(movieId);
      console.log('Comments fetched:', comments);
      res.status(200).json(comments);
    } catch (error: unknown) {
      console.error('Failed to get comments:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: 'Failed to get comments', details: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async updateComment(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const { content, rating } = req.body;
      const userId = req.user?.id;
  
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
  
      const updatedComment = await CommentService.updateComment(commentId, userId, content, rating);
      
      if (!updatedComment) {
        return res.status(404).json({ error: 'Comment not found or you are not authorized to update this comment' });
      }
  
      res.status(200).json({ message: 'Comment updated', comment: updatedComment });
    } catch (error: unknown) {
      console.error('Failed to update comment:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: 'Failed to update comment', details: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
  
  async deleteComment(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const userId = req.user?.id;
  
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
  
      const deletedComment = await CommentService.deleteComment(commentId, userId);
  
      if (!deletedComment) {
        return res.status(404).json({ error: 'Comment not found or you are not authorized to delete this comment' });
      }
  
      res.status(200).json({ message: 'Comment deleted', comment: deletedComment });
    } catch (error: unknown) {
      console.error('Failed to delete comment:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: 'Failed to delete comment', details: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
}

export default new CommentController();