import express from "express";
import authController from "../controllers/authController";
import validateUserRegistration from "../middlewares/userValidation";

const authenticationRoute = express.Router();

authenticationRoute.post(
  "/register",
  validateUserRegistration,
  authController.register
);
authenticationRoute.post("/login", authController.login);

export default authenticationRoute;
