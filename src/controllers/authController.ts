import { Request, Response } from "express";

const register = (req: Request, res: Response) => {
  res.send("welcome to register controller");
};

const login = (req: Request, res: Response) => {
  res.send("welcome to login controller");
};

export default { register, login };
