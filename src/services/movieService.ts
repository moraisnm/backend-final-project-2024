import IMovie from '../interfaces/movieInterface.js';
import MovieModel from '../models/movieModel.js';
import fileService from '../utils/fileService.js';

class MovieService {
  async getAll() {
    try {
      return await MovieModel.find().lean();
    } catch (err) {
      console.error('Error getting all movies:', err);
      throw err;
    }
  }

  async getOne(movieId: string) {
    try {
      return await MovieModel.findById(movieId).lean();
    } catch (err) {
      console.error('Error getting movie:', err);
      throw err;
    }
  }

  async create(movieData: IMovie, poster: any) {
    try {
      if (poster) {
        const posterUrl = fileService.save(poster);
        movieData.posterUrl = posterUrl;
      }
      const newMovie = new MovieModel(movieData);
      return await newMovie.save();
    } catch (err) {
      console.error('Error creating movie:', err);
      throw err;
    }
  }

  async update(movieId: string, updateData: Partial<IMovie>) {
    try {
      return await MovieModel.findByIdAndUpdate(movieId, updateData, { new: true }).lean();
    } catch (err) {
      console.error('Error updating movie:', err);
      throw err;
    }
  }

  async delete(movieId: string) {
    try {
      return await MovieModel.findByIdAndDelete(movieId).lean();
    } catch (err) {
      console.error('Error deleting movie:', err);
      throw err;
    }
  }
}

export default new MovieService();