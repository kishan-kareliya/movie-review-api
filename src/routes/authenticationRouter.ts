import express from "express";
import authController from "../controllers/authController";
import userValidation from "../middlewares/userValidation";
import path from "node:path";
import multer from "multer";

const authenticationRoute = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/users/profileImage"),
});

authenticationRoute.post(
  "/register",
  upload.single("profileImage"),
  userValidation.validateRegistration,
  authController.register
);
authenticationRoute.post(
  "/login",
  userValidation.validateLogin,
  authController.login
);

export default authenticationRoute;
