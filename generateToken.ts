import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

interface UserData {
  id: string;
  email: string;
  role: string;
}

const generateToken = (userData: UserData): string => {
  return jwt.sign(userData, JWT_SECRET, { expiresIn: '1h' });
};

const userData: UserData = { id: 'someUserId', email: 'user@example.com', role: 'ADMIN' };
const token = generateToken(userData);
console.log("Generated Token:", token);