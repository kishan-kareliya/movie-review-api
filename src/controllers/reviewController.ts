import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import reviewModel from "../models/review";

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

export default { addReview };
