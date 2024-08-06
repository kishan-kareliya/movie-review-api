import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { z } from "zod";

const userRegistrationSchema = z.object({
  username: z.string().min(2, "username atleast 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "password must be atleast 8 characters"),
  profileImage: z.string().optional(),
});

const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = userRegistrationSchema.safeParse(req.body);
  if (!result.success) {
    const error = createHttpError(400, "validation error");
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
