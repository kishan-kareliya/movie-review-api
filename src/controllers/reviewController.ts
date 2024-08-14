import { Request, Response, NextFunction } from "express";

const addReview = async (req: Request, res: Response, next: NextFunction) => {
  res.send("add review");
};

export default { addReview };
