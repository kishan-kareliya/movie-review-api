import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { z } from "zod";
import movieModel from "../models/movie";
import reviewModel from "../models/review";

const addReviewSchema = z.object({
  movieId: z.string(),
  userId: z.string(),
  rating: z
    .number()
    .min(0, "rating must be minimum 0")
    .max(5, "rating must be maximum 5"),
  comment: z.string().min(2, "comment must be atlest 2 characters"),
});

type AuthenticatedRequest = Request & { userId?: string };

const addReviewValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { movieId, rating, comment } = req.body;
  const _req = req as AuthenticatedRequest;
  const { userId } = _req;

  const result = addReviewSchema.safeParse({
    movieId,
    userId,
    rating,
    comment,
  });

  if (!result.success) {
    return next(createHttpError(400, "Validation error"));
  }

  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return next(createHttpError(400, "Invalid movieId"));
  }

  try {
    const existMovie = await movieModel.findById(movieId);
    if (!existMovie) {
      return next(createHttpError(404, "Movie not found"));
    }

    //only one user review one movie at a time
    const existData = await reviewModel.findOne({
      movieId,
      userId,
    });

    if (existData) {
      return next(createHttpError(409, "Review already exist for this movie"));
    }

    next();
  } catch (error) {
    return next(createHttpError(500, "Internal server error"));
  }
};

const updateReviewSchema = z.object({
  userId: z.string(),
  rating: z
    .number()
    .min(0, "rating must be minimum 0")
    .max(5, "rating must be maximum 5")
    .optional(),
  comment: z.string().min(2, "comment must be atlest 2 characters").optional(),
});

const updateReviewValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { rating, comment } = req.body;
  const { id } = req.params;
  const _req = req as AuthenticatedRequest;
  const { userId } = _req;

  const result = updateReviewSchema.safeParse({
    userId,
    rating,
    comment,
  });

  //validate reviewId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createHttpError(400, "Invalid review id"));
  }

  if (!result.success) {
    return next(createHttpError(400, "Validation error"));
  }

  try {
    //check that review exist in db or not
    const existData = await reviewModel.findById(id);

    if (!existData) {
      return next(createHttpError(404, "Review not exist in database"));
    }

    next();
  } catch (error) {
    return next(createHttpError(500, "Internal server error"));
  }
};

const deleteReviewValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  //validate reviewId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createHttpError(400, "Invalid review id"));
  }

  try {
    //check that review exist in db or not
    const existData = await reviewModel.findById(id);

    if (!existData) {
      return next(createHttpError(404, "Review not exist in database"));
    }

    next();
  } catch (error) {
    return next(createHttpError(500, "Internal server error"));
  }
};

export default {
  addReviewValidation,
  updateReviewValidation,
  deleteReviewValidation,
};
