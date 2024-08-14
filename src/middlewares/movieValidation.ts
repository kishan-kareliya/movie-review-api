import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import path from "node:path";
import deleteImage from "../utils/deleteFile";
import movieModel from "../models/movie";
import mongoose from "mongoose";

const addMovieSchema = z.object({
  title: z.string().min(2, "movie title must be atleast 2 character"),
  genre: z.string().min(2, "movie genre must be atleast 2 character"),
  director: z.string().min(2, "movie director must be atleast 2 character"),
  releaseDate: z.string().date(),
  description: z
    .string()
    .min(10, "movie description must be atleast 2 character"),
  coverImage: z.any(),
});

const validateAddMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, genre, director, releaseDate, description } = req.body;
  const result = addMovieSchema.safeParse({
    title,
    genre,
    director,
    releaseDate,
    description,
    coverImage: req.file,
  });

  if (!result.success) {
    //if validation failed then delete image from server
    const movieImageName = req.file?.filename;
    await deleteImage(
      path.resolve(__dirname, `../../public/movies/images/${movieImageName}`)
    );

    const error = createHttpError(400, "Validation error");
    return next(error);
  }

  //check movie title already exist or not
  const existTitle = await movieModel.findOne({
    title,
  });

  //if title already exist then delete image from server
  if (existTitle) {
    const movieImageName = req.file?.filename;
    await deleteImage(
      path.resolve(__dirname, `../../public/movies/images/${movieImageName}`)
    );
    return next(createHttpError(403, "Movie title already exist"));
  }

  next();
};

const updateMovieSchema = z.object({
  title: z
    .string()
    .min(2, "movie title must be atleast 2 character")
    .optional(),
  genre: z
    .string()
    .min(2, "movie genre must be atleast 2 character")
    .optional(),
  director: z
    .string()
    .min(2, "movie director must be atleast 2 character")
    .optional(),
  releaseDate: z.string().date().optional(),
  description: z
    .string()
    .min(10, "movie description must be atleast 2 character")
    .optional(),
  coverImage: z.any().optional(),
});

const validateUpdateMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, genre, director, releaseDate, description } = req.body;
  const { id } = req.params;
  const result = updateMovieSchema.safeParse({
    title,
    genre,
    director,
    releaseDate,
    description,
    coverImage: req.file,
  });

  if (!result.success) {
    //if validation failed then delete image from server
    if (req.file) {
      const movieImageName = req.file?.filename;

      await deleteImage(
        path.resolve(__dirname, `../../public/movies/images/${movieImageName}`)
      );
    }

    const error = createHttpError(400, "Validation error");
    return next(error);
  }

  //check movie title already exist or not
  const existTitle = await movieModel.findOne({
    title,
  });

  // If the title exists, check if its ID matches the current movie's ID.
  // If they don't match, the title is already used by another movie.

  if (existTitle && existTitle._id.toString() !== id) {
    if (req.file) {
      const movieImageName = req.file.filename;
      const imagePath = path.resolve(
        __dirname,
        `../../public/movies/images/${movieImageName}`
      );
      await deleteImage(imagePath);
    }
    return next(createHttpError(403, "Movie title already exists"));
  }

  next();
};

export default { validateAddMovie, validateUpdateMovie };
