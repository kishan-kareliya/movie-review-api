import { Request, Response, NextFunction } from "express";
import userModel from "../models/user";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "fs/promises";

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
) => {
  const _req = req as AuthenticatedRequest;
  const { username, email } = req.body;
  const profileImage = req.file;
  const { userId } = _req;

  //check that profile image received or not if receive then upload to the cloud
  let profileImageResult;
  if (profileImage) {
    //upload image to the cloudinary
    const profileImageMimeType = profileImage.mimetype.split("/").at(-1);
    const imageName = profileImage.filename;
    const imagePath = path.resolve(
      __dirname,
      `../../public/users/profileImage/${imageName}`
    );
    try {
      profileImageResult = await cloudinary.uploader.upload(imagePath, {
        filename_override: imageName,
        folder: "MovieReviewApp/users/profileImage",
        format: profileImageMimeType,
      });
    } catch (error) {
      return next(
        createHttpError(500, "Error while uploading image to cloudinary")
      );
    }
    //delete image locally from server
    try {
      await fs.unlink(imagePath);
    } catch (error) {
      return next(createHttpError(500, "Error while deleting image locally"));
    }
  }

  //check if profile image successfull upload or not
  let profileImagePath = "";
  if (profileImageResult) {
    profileImagePath = profileImageResult.secure_url;
  }
  try {
    const updateUser = {
      ...(username && { username }),
      ...(email && { email }),
      ...(profileImagePath && { profileImage: profileImagePath }),
    };

    const updateUserResult = await userModel.findByIdAndUpdate(
      userId,
      updateUser
    );

    if (!updateUserResult) {
      return next(
        createHttpError(422, "Error while updating data to the database")
      );
    }

    res.status(202).json({
      message: "data updated successfully",
    });
  } catch (error) {
    next(createHttpError(500, "Internal server error"));
  }
};

export default { getUserProfile, updateUserProfile };
