import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "../models/user";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  //check that username or email exist in the database or not
  const existData = await userModel.find({
    $or: [{ username: username }, { email: email }],
  });

  if (existData.length > 0) {
    // if username or email already exist then first check user upload profileImage or not
    const profileImageName = req.file?.filename;

    // if user upload profile picture then deleted from our server
    if (profileImageName) {
      try {
        await fs.unlink(
          path.resolve(
            __dirname,
            `../../public/users/profileImage/${profileImageName}`
          )
        );
      } catch (err) {
        console.error("Error deleting temporary file:", err);
      }
    }

    const error = createHttpError(403, "Username or Email Already Exist");
    return next(error);
  }

  // check that profileImage received or not
  let profileImageResult;
  if (req.file) {
    //upload image to cloudinary
    const profileImageMimeType = req.file.mimetype.split("/").at(-1);
    const imageName = req.file.filename;
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

  //encrypt password through hashing
  const encryptedPassword = await bcrypt.hash(password, 10);

  //insert data into database
  let result;
  if (profileImageResult) {
    const profileImageLink = profileImageResult.secure_url;
    try {
      result = await userModel.create({
        username,
        email,
        password: encryptedPassword,
        profileImage: profileImageLink,
      });
    } catch (error) {
      return next(
        createHttpError(500, "Error while insert data into the database")
      );
    }
  } else {
    try {
      result = await userModel.create({
        username,
        email,
        password: encryptedPassword,
        profileImage: "",
      });
    } catch (error) {
      return next(
        createHttpError(500, "Error while insert data into the database")
      );
    }
  }
  //create jwt token
  const userId = result._id;
  const token = Jwt.sign(
    {
      sub: userId,
    },
    process.env.JWT_SECRET as string
  );
  //pass jwt
  res.status(201).json({
    accessToken: token,
  });
};

const login = (req: Request, res: Response) => {
  res.send("welcome to login controller");
};

export default { register, login };
