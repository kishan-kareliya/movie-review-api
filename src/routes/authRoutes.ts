import express from "express";
import authController from "../controllers/authController";
import userValidation from "../middlewares/userValidation";
import path from "node:path";
import multer from "multer";

const authRoute = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/users/profileImage"),
});

authRoute.post(
  "/register",
  upload.single("profileImage"),
  userValidation.validateRegistration,
  authController.register
);
authRoute.post("/login", userValidation.validateLogin, authController.login);

export default authRoute;
