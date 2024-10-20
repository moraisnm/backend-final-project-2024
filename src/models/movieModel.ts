import IMovie from "../interfaces/movieInterface.js";
import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema<IMovie>({
    title: { 
        type: String,
        required: true
    },
    releaseDate: { 
        type: Date,
        required: true
    },
    trailerLink: { 
        type: String,
        required: true
    },
    posterUrl: { 
        type: String,
        default: 'No_Image.jpg'
    },
    genres: { 
        type: [String],
        required: true
    },
});

const MovieModel = mongoose.model<IMovie>('Movie', MovieSchema);

export default MovieModel;