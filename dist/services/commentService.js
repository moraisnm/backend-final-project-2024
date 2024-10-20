import CommentModel from '../models/commentModel.js';
class CommentService {
    async addComment(userId, movieId, content, rating) {
        try {
            console.log('Adding comment:', { userId, movieId, content, rating });
            const comment = new CommentModel({
                user: userId,
                movie: movieId,
                content,
                rating
            });
            const savedComment = await comment.save();
            console.log('Comment saved:', savedComment);
            return savedComment;
        }
        catch (error) {
            console.error('Error in CommentService.addComment:', error);
            throw error;
        }
    }
    async getCommentsForMovie(movieId) {
        try {
            console.log('Fetching comments for movie:', movieId);
            const comments = await CommentModel.find({ movie: movieId }).populate('user', 'name');
            console.log('Comments fetched:', comments);
            return comments;
        }
        catch (error) {
            console.error('Error in CommentService.getCommentsForMovie:', error);
            throw error;
        }
    }
    async updateComment(commentId, userId, content, rating) {
        try {
            const comment = await CommentModel.findOne({ _id: commentId, user: userId });
            if (!comment) {
                return null;
            }
            comment.content = content;
            comment.rating = rating;
            const updatedComment = await comment.save();
            return updatedComment;
        }
        catch (error) {
            console.error('Error in CommentService.updateComment:', error);
            throw error;
        }
    }
    async deleteComment(commentId, userId) {
        try {
            const deletedComment = await CommentModel.findOneAndDelete({ _id: commentId, user: userId });
            return deletedComment;
        }
        catch (error) {
            console.error('Error in CommentService.deleteComment:', error);
            throw error;
        }
    }
}
export default new CommentService();
