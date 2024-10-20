import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
export const generateToken = (userData) => {
    return jwt.sign(userData, JWT_SECRET, { expiresIn: '1h' });
};
