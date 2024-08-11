import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import path from "node:path";
import userModel from "../models/user";
import deleteImage from "../utils/deleteFile";

const userRegistrationSchema = z.object({
  username: z.string().min(2, "username atleast 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "password must be atleast 8 characters"),
  profileImage: z.any().optional(),
});

const validateRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  const result = userRegistrationSchema.safeParse({
    username,
    email,
    password,
    profileImage: req.file,
  });

  if (!result.success) {
    // if validation error then first check user upload profileImage or not
    const profileImageName = req.file?.filename;

    // if user upload profile picture then deleted from our server
    if (profileImageName) {
      await deleteImage(
        path.resolve(
          __dirname,
          `../../public/users/profileImage/${profileImageName}`
        )
      );
    }

    const error = createHttpError(400, "Validation error");
    return next(error);
  }

  next();
};

const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "password must be atleast 8 characters"),
});

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const result = userLoginSchema.safeParse(req.body);
  if (!result.success) {
    const error = createHttpError(400, "validation error");
    return next(error);
  }
  next();
};

const userProfileUpdateSchema = z.object({
  username: z
    .string()
    .min(2, "username must be atlest 2 characters")
    .optional(),
  email: z.string().email("invalid email address").optional(),
  profileImage: z.any().optional(),
});

const validateUserProfileUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email } = req.body;
  const result = userProfileUpdateSchema.safeParse({
    username,
    email,
    profileImage: req.file,
  });

  if (!result.success) {
    const profileImageName = req.file?.filename;

    // If the user uploaded a profile picture and there's a validation error, delete the uploaded image
    if (profileImageName) {
      await deleteImage(
        path.resolve(
          __dirname,
          `../../public/users/profileImage/${profileImageName}`
        )
      );
    }

    const error = createHttpError(400, "Validation error");
    return next(error);
  }

  //check username and email already exist in the database or not
  const existData = await userModel.find({
    $or: [{ username: username }, { email: email }],
  });

  if (existData.length > 0) {
    // if username or email already exist then first check user upload profileImage or not
    const profileImageName = req.file?.filename;

    // if user upload profile picture then deleted from our server
    if (profileImageName) {
      deleteImage(
        path.resolve(
          __dirname,
          `../../public/users/profileImage/${profileImageName}`
        )
      );
    }

    const error = createHttpError(403, "Username or Email Already Exist");
    return next(error);
  }

  next();
};

export default {
  validateRegistration,
  validateLogin,
  validateUserProfileUpdate,
};
