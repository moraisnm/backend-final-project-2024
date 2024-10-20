import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export const generateToken = (userData: { id: string, email: string, role: string }) => {
  return jwt.sign(userData, JWT_SECRET, { expiresIn: '1h' });
};