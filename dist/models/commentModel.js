import mongoose, { Schema } from 'mongoose';
const CommentSchema = new Schema({
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    movie: {
        type: String,
        ref: 'Movie',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const CommentModel = mongoose.model('Comment', CommentSchema);
export default CommentModel;
