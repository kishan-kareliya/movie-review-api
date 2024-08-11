import express, { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import userModel from "../models/user";
import UserType from "../types/userType";

const userRoute = express.Router();

userRoute.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

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

    const userPayload = {
      _id: response._id,
      username: response.username,
      email: response.email,
      profileImage: response.profileImage,
    };

    res.json(userPayload);
  }
);

export default userRoute;
