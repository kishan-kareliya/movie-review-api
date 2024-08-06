import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";

const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    status: "error",
    message: err.message,
    errorStack: process.env.NODE_ENV === "development" ? err.stack : "",
  });
};

export default errorHandler;
