import express, { Express } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import { logger } from "./middlewares/authMiddleware.js";
import moviesRouter from './routers/moviesRouter.js';
import usersRouter from './routers/usersRouter.js';
import commentsRouter from './routers/commentsRouter.js';
import { setupSwagger } from './utils/swaggerConfig.js';

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors({ origin: '*' }));
app.use(logger);
app.use(express.static('static'));

// Routers
app.use('/api', usersRouter);
app.use('/api', moviesRouter);
app.use('/api', commentsRouter);

// Setup Swagger
setupSwagger(app);

const PORT = process.env.PORT || 8000;

const startApp = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(String(process.env.MONGO_URI));
    console.log('Successfully connected to MongoDB');
    
    app.listen(PORT, () => {
      if (process.env.NODE_ENV === 'production') {
        console.log(`Server is running in production mode on port ${PORT}`);
      } else {
        console.log(`Server is running in development mode on port ${PORT}`);
      }
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error connecting to database:", err.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
};

startApp();