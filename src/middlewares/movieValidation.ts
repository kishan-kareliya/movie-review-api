import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import path from "node:path";
import deleteImage from "../utils/deleteFile";

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
  next();
};

export default { validateAddMovie };
