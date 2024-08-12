import { Request, Response, NextFunction } from "express";
import path from "node:path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import deleteImage from "../utils/deleteFile";
import movieModel from "../models/movie";

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

export default { addMovie };
