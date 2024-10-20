import { Document } from 'mongoose';

export default interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    role: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}