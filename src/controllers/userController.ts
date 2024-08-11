import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import userModel from "../models/user";

type AuthenticatedRequest = Request & { userId?: string };

const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const _req = req as AuthenticatedRequest;
  const userId = _req.userId;

  //check id is valid or not
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createHttpError(400, "Invalid id"));
  }

  //check user exist or not
  const response = await userModel.findOne({
    _id: id,
  });

  if (!response) {
    return next(createHttpError(404, "User doesn't exist"));
  }

  //check user trying to acess profile is this user or not
  if (userId != response._id.toString()) {
    return next(
      createHttpError(403, "can't allow access to the requested resource")
    );
  }

  const userPayload = {
    _id: response._id,
    username: response.username,
    email: response.email,
    profileImage: response.profileImage,
  };

  res.json(userPayload);
};

export default { getUserProfile };
