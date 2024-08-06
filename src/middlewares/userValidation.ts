import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import path from "node:path";
import fs from "fs/promises";

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

export default { validateRegistration, validateLogin };
