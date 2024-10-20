import movieService from '../services/movieService.js';
import { validationResult } from "express-validator";
class MovieController {
    async getAll(req, res, next) {
        try {
            const movies = await movieService.getAll();
            res.status(200).json(movies);
        }
        catch (error) {
            console.error('Error fetching movies:', error);
            res.status(500).json({ error: 'Failed to fetch movies' });
        }
    }
    async getOne(req, res, next) {
        try {
            const movieId = req.params.id;
            const movie = await movieService.getOne(movieId);
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            res.status(200).json(movie);
        }
        catch (error) {
            console.error('Error fetching movie:', error);
            res.status(500).json({ error: 'Failed to fetch movie' });
        }
    }
    async create(req, res, next) {
        var _a;
        try {
            const { title, releaseDate, trailerLink, genres } = req.body;
            const poster = (_a = req.files) === null || _a === void 0 ? void 0 : _a.poster;
            const movieData = {
                title,
                releaseDate,
                trailerLink,
                genres
            };
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const createdMovie = await movieService.create(movieData, poster);
            res.status(201).json(createdMovie);
        }
        catch (err) {
            console.error('Error creating movie:', err);
            next(err);
        }
    }
    async update(req, res, next) {
        var _a;
        try {
            const movieId = req.params.id;
            const { title, releaseDate, trailerLink, genres } = req.body;
            const poster = (_a = req.files) === null || _a === void 0 ? void 0 : _a.poster;
            const movieData = {
                title,
                releaseDate,
                trailerLink,
                genres
            };
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const updatedMovie = await movieService.update(movieId, movieData);
            if (!updatedMovie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            res.status(200).json(updatedMovie);
        }
        catch (err) {
            console.error('Error updating movie:', err);
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            const movieId = req.params.id;
            const deletedMovie = await movieService.delete(movieId);
            if (!deletedMovie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            res.status(200).json({ message: 'Movie deleted successfully' });
        }
        catch (err) {
            console.error('Error deleting movie:', err);
            next(err);
        }
    }
}
export default new MovieController();
