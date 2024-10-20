import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fileService from '../utils/fileService.js';
dotenv.config();
class UserService {
    constructor() {
        this.getAll = async () => {
            try {
                return await UserModel.find();
            }
            catch (error) {
                throw new Error('Failed to get all users');
            }
        };
        this.getUserById = async (userId) => {
            try {
                return await UserModel.findById(userId);
            }
            catch (error) {
                throw new Error('Failed to get user by ID');
            }
        };
        this.register = async (newUser, avatar) => {
            try {
                const foundUser = await UserModel.findOne({ email: newUser.email });
                if (foundUser) {
                    throw new Error('Email already exists');
                }
                let avatarName = "avatar.jpg";
                if (avatar) {
                    avatarName = fileService.save(avatar);
                }
                newUser.avatar = avatarName;
                const hashedPassword = await bcrypt.hash(newUser.password, 10);
                newUser.password = hashedPassword;
                return await UserModel.create(newUser);
            }
            catch (error) {
                throw new Error('Failed to create user');
            }
        };
        this.login = async (email, password) => {
            try {
                console.log('Attempting login for email:', email);
                const foundUser = await UserModel.findOne({ email: email });
                if (!foundUser) {
                    console.log('No user found with email:', email);
                    return null;
                }
                console.log('User found:', foundUser.email);
                const isPasswordValid = await bcrypt.compare(password, foundUser.password);
                if (!isPasswordValid) {
                    console.log('Invalid password for user:', email);
                    return null;
                }
                console.log('Password is valid for user:', email);
                const token = jwt.sign({ id: foundUser._id, email: foundUser.email, role: foundUser.role }, process.env.JWT_SECRET);
                console.log('Token generated:', token);
                return { user: foundUser, accessToken: token };
            }
            catch (error) {
                console.error('Login error:', error);
                throw new Error('Failed to log in user');
            }
        };
        this.update = async (userId, user) => {
            try {
                return await UserModel.findByIdAndUpdate(userId, user, { new: true });
            }
            catch (error) {
                throw new Error('Failed to update user');
            }
        };
        this.delete = async (userId) => {
            try {
                return await UserModel.findByIdAndDelete(userId);
            }
            catch (error) {
                throw new Error('Failed to delete user');
            }
        };
    }
}
export default new UserService();
