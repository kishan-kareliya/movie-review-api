import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  genre: {
    type: String,
    trim: true,
    required: true,
  },
  director: {
    type: String,
    trim: true,
    required: true,
  },
  releaseDate: {
    type: Date,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
});

const movieModel = mongoose.model("movie", movieSchema);

export default movieModel;
