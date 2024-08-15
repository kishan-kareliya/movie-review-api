import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import User from "../models/user"; // Adjust the path to your User model
import userModel from "../models/user";

type AuthenticatedRequest = Request & { userId?: string };

const authorizeAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const _req = req as AuthenticatedRequest;
    const { userId } = _req;

    if (!userId) {
      return next(createHttpError(401, "Unauthorized"));
    }

    // Fetch the user from the database using the userId
    const user = await userModel.findById(userId);

    if (!user || !user.isAdmin) {
      return next(createHttpError(403, "Forbidden: Admins only"));
    }

    next();
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

export default authorizeAdmin;
