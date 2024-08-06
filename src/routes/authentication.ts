import express from "express";
import authController from "../controllers/authController";
import userValidation from "../middlewares/userValidation";

const authenticationRoute = express.Router();

authenticationRoute.post(
  "/register",
  userValidation.validateRegistration,
  authController.register
);
authenticationRoute.post(
  "/login",
  userValidation.validateLogin,
  authController.login
);

export default authenticationRoute;
