import express from "express";
import authentication from "../middlewares/authentication";
import userController from "../controllers/userController";
import userAuthorization from "../middlewares/authorization";

const userRoute = express.Router();

userRoute.get(
  "/:id",
  authentication,
  userAuthorization,
  userController.getUserProfile
);

userRoute.put(
  "/:id",
  authentication,
  userAuthorization,
  userController.updateUserProfile
);

export default userRoute;
