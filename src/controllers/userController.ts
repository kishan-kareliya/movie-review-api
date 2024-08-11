import { Request, Response, NextFunction } from "express";
import userModel from "../models/user";
import createHttpError from "http-errors";

type AuthenticatedRequest = Request & {
  userId?: string;
};

const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _req = req as AuthenticatedRequest;
  const { userId } = _req;

  try {
    const user = await userModel
      .findById(userId)
      .select("username email profileImage");

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    const userPayload = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    };

    res.json(userPayload);
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export default { getUserProfile, updateUserProfile };
