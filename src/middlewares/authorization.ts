import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "../models/user";
import mongoose from "mongoose";

type AuthenticatedRequest = Request & {
  userId?: string;
};

const userAuthorization = async (
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

  // Check if the user is authorized to access this resource
  if (userId != response._id.toString()) {
    return next(
      createHttpError(403, "Unauthorized access to the requested resource")
    );
  }
  next();
};

export default userAuthorization;
