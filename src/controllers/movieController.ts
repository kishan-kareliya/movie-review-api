import { Request, Response, NextFunction } from "express";
import path from "node:path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import deleteImage from "../utils/deleteFile";
import movieModel from "../models/movie";
import mongoose from "mongoose";

const addMovie = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre, director, releaseDate, description } = req.body;
  const movieImage = req.file;

  let movieImageResult;

  if (movieImage) {
    const movieImageMimeType = movieImage.mimetype.split("/").at(-1);
    const movieImageName = movieImage.filename;
    const movieImagePath = path.resolve(
      __dirname,
      `../../public/movies/images/${movieImageName}`
    );

    try {
      movieImageResult = await cloudinary.uploader.upload(movieImagePath, {
        filename_override: movieImageName,
        folder: "MovieReviewApp/movies/images",
        format: movieImageMimeType,
      });
    } catch (error) {
      return next(
        createHttpError(500, "Error while uploadin image to cloudinary")
      );
    }

    //delete image locally from server
    await deleteImage(movieImagePath);
  }

  // after successfully upload image to cloudinary add data to the db
  if (movieImageResult) {
    const movieImageUrl = movieImageResult.secure_url;
    try {
      const addMovieResult = await movieModel.create({
        title,
        genre,
        director,
        releaseDate,
        description,
        coverImage: movieImageUrl,
      });

      if (!addMovieResult) {
        return next(
          createHttpError(422, "Error while add data to the database")
        );
      }

      res.status(202).json({
        message: "movie added successfully",
      });
    } catch (error) {
      return next(createHttpError(500, "Internal server error"));
    }
  }
};

const updateMovie = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre, director, releaseDate, description } = req.body;
  const { id } = req.params;
  const movieImage = req.file;

  let movieImageResult;

  if (movieImage) {
    const movieImageMimeType = movieImage.mimetype.split("/").at(-1);
    const movieImageName = movieImage.filename;
    const movieImagePath = path.resolve(
      __dirname,
      `../../public/movies/images/${movieImageName}`
    );

    try {
      movieImageResult = await cloudinary.uploader.upload(movieImagePath, {
        filename_override: movieImageName,
        folder: "MovieReviewApp/movies/images",
        format: movieImageMimeType,
      });
    } catch (error) {
      return next(
        createHttpError(500, "Error while uploadin image to cloudinary")
      );
    }

    //delete image locally from server
    await deleteImage(movieImagePath);
  }

  // check image received and image upload to the cloudinary then fetch url
  let movieImageUrl;
  if (movieImageResult) {
    movieImageUrl = movieImageResult.secure_url;
  }

  //create movie update payload;
  let movieUpdatePayload: any = {};
  if (title) movieUpdatePayload.title = title;
  if (genre) movieUpdatePayload.genre = genre;
  if (director) movieUpdatePayload.director = director;
  if (releaseDate) movieUpdatePayload.releaseDate = releaseDate;
  if (description) movieUpdatePayload.description = description;
  if (movieImageUrl) movieUpdatePayload.coverImage = movieImageUrl;

  try {
    const updateMovieResult = await movieModel.findByIdAndUpdate(
      id,
      movieUpdatePayload
    );

    if (!updateMovieResult) {
      return next(
        createHttpError(422, "Error while updating data to the database")
      );
    }

    res.status(202).json({
      message: "movie updated successfully",
    });
  } catch (error) {
    return next(createHttpError(500, "Internal server error"));
  }
};

const getMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fetchMovies = await movieModel.find({});
    res.status(200).json(fetchMovies);
  } catch (error) {
    return next(createHttpError(500, "Internal server error"));
  }
};

const getMovieById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createHttpError(400, "Invalid movie id"));
  }

  try {
    const movieResult = await movieModel.findById(id);
    if (!movieResult) {
      return next(createHttpError(404, "Movie Not Found"));
    }
    return res.status(200).json(movieResult);
  } catch (error) {
    return next(createHttpError(500, "Internal server Error"));
  }
};

const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createHttpError(400, "Invalid movie id"));
  }

  try {
    const deleteMovieResult = await movieModel.findByIdAndDelete(id);
    if (!deleteMovieResult) {
      return next(createHttpError(404, "Movie Not Found"));
    }
    return res.status(202).json({
      message: "movie deleted successfully!",
    });
  } catch (error) {
    return next(createHttpError(500, "Internal server Error"));
  }
};

const searchMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return next(createHttpError(400, "Invalid search query"));
  }

  try {
    const searchMovieResult = await movieModel.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { director: { $regex: q, $options: "i" } },
      ],
    });

    if (searchMovieResult.length === 0) {
      return next(createHttpError(404, "Movie Not Found"));
    }

    return res.status(200).json(searchMovieResult);
  } catch (error) {
    return next(createHttpError(500, "Internal server Error"));
  }
};

const filterMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { genre, releaseDate } = req.query;

  let filter: any = {};
  if (genre) filter.genre = genre;
  if (releaseDate) filter.releaseDate = releaseDate;

  try {
    const filterMoviesResult = await movieModel.find(filter);

    if (filterMoviesResult.length === 0) {
      return next(createHttpError(404, "Movie Not Found"));
    }

    return res.status(200).json(filterMoviesResult);
  } catch (error) {
    return next(createHttpError(500, "Internal server Error"));
  }
};

export default {
  addMovie,
  getMovies,
  getMovieById,
  deleteMovie,
  searchMovies,
  filterMovies,
  updateMovie,
};
