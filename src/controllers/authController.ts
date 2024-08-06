import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const register = (req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(502, "testing error handling"));
};

const login = (req: Request, res: Response) => {
  res.send("welcome to login controller");
};

export default { register, login };
