import { Request, Response } from "express";
import { IUser } from "../models/userModel.js";
import userService from "../services/userService.js";
import { validationResult } from "express-validator";

class UserController {
  getAll = async (req: Request, res: Response) => {
    try {
      const users: IUser[] = await userService.getAll();
      res.json(users);
    } catch (error) {
      console.error('Failed to get users:', error);
      res.status(500).json({ error: "Failed to get users" });
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const userId: string = req.params.id;
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error('Failed to get user:', error);
      res.status(500).json({ error: "Failed to get user" });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { name, email, password, role } = req.body;
      const avatar = req.files?.avatarFile;

      const userToCreate = { name, email, password, role } as IUser;
      const createdUser = await userService.register(userToCreate, avatar);
      res.status(201).json(createdUser);
    } catch (error) {
      console.error('Failed to create user:', error);
      res.status(500).json({ error: "Failed to create user" });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt:', email);
      
      const foundUserWithToken = await userService.login(email, password);
      if (!foundUserWithToken) {
        console.log('Login failed for:', email);
        return res.status(404).json({ error: "Invalid email or password" });
      }
      
      console.log('Login successful for:', email);
      console.log('Token generated:', foundUserWithToken.accessToken);
      res.json(foundUserWithToken);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Failed to login" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const userId: string = req.params.id;
      const { name, email, password, role } = req.body;
      const userToUpdate = { name, email, password, role } as Partial<IUser>;
      const updatedUser = await userService.update(userId, userToUpdate);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
      res.status(500).json({ error: "Failed to update user" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const userId: string = req.params.id;
      const deletedUser = await userService.delete(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error('Failed to delete user:', error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  };
}

export default new UserController();