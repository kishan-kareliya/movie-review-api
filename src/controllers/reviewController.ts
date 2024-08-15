import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import reviewModel from "../models/review";
import { randomInt } from "crypto";

type AuthenticatedRequest = Request & { userId?: string };

const addReview = async (req: Request, res: Response, next: NextFunction) => {
  const { movieId, rating, comment } = req.body;
  const _req = req as AuthenticatedRequest;
  const { userId } = _req;

  try {
    const addReviewResult = await reviewModel.create({
      movieId,
      userId,
      rating,
      comment,
    });

    if (!addReviewResult) {
      return next(createHttpError("Error while add data to the database"));
    }

    res.status(202).json({
      message: "Review added successfully!",
    });
  } catch (error) {
    next(createHttpError(500, "Internal server Error!"));
  }
};

const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { rating, comment } = req.body;
  const { id } = req.params;

  const updateMoviePayload: any = {};
  if (rating) updateMoviePayload.rating = rating;
  if (comment) updateMoviePayload.comment = comment;

  try {
    const updateReviewResult = await reviewModel.findByIdAndUpdate(
      id,
      updateMoviePayload
    );

    if (!updateReviewResult) {
      return next(createHttpError("Error while add data to the database"));
    }

    res.status(202).json({
      message: "Review updated successfully!",
    });
  } catch (error) {
    next(createHttpError(500, "Internal server Error!"));
  }
};

export default { addReview, updateReview };
