import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Jwt, { JwtPayload } from "jsonwebtoken";

// Define a custom type that extends the Request interface
type AuthenticatedRequest = Request & { userId?: string };

const authentication = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  // If token is not there then show error message
  if (!token) {
    return next(createHttpError(498, "Token not found"));
  }

  // Split token by removing Bearer
  const parsedToken = token.split(" ")[1];

  try {
    // Check if the token is valid or not
    const result = Jwt.verify(
      parsedToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!result || !result.sub) {
      return next(createHttpError(401, "Invalid Token"));
    }

    const _req = req as AuthenticatedRequest;
    _req.userId = result.sub;
    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid Token"));
  }
};

export default authentication;
