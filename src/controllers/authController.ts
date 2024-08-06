import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const register = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  console.log(req.file);
  res.send("welcome to register endpoint");
};

const login = (req: Request, res: Response) => {
  res.send("welcome to login controller");
};

export default { register, login };
