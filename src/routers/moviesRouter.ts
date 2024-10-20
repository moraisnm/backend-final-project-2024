import { Router } from "express";
import MovieController from "../controllers/movieController.js";
import { check } from "express-validator";
import { checkAuth, checkRole } from '../middlewares/authMiddleware.js';

const router: Router = Router();

const validateMovie = [
  check("title").notEmpty().withMessage("Movie title is required"),
  check("releaseDate").notEmpty().withMessage("Movie release date is required"),
  check("trailerLink").notEmpty().withMessage("Movie-trailer link is required"),
  check("poster").custom((value, { req }) => {
    if (!req.files || !req.files.poster) {
      throw new Error("Poster is required");
    }
    return true;
  }),
  check("genres").notEmpty().withMessage("Movie genres are required")
];

router.get('/movies', MovieController.getAll);
router.get('/movies/:id', MovieController.getOne);
router.post('/movies', checkAuth, checkRole(['ADMIN']), validateMovie, MovieController.create);
router.put('/movies/:id', MovieController.update);
router.delete('/movies/:id', MovieController.delete);

export default router;