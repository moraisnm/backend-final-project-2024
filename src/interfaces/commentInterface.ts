import { Document } from 'mongoose';

export default interface IComment extends Document {
    user: String;
    movie: String;
    content: String;
    rating: Number;
    createdAt: Date;
}