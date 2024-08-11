import express from "express";
import authenticateUser from "../middlewares/authenticateUser";
import userController from "../controllers/userController";
import authorizeUser from "../middlewares/authorizeUser";
import multer from "multer";
import path from "node:path";
import userValidation from "../middlewares/userValidation";

const userRoute = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/users/profileImage"),
});

userRoute.get(
  "/:id",
  authenticateUser,
  authorizeUser,
  userController.getUserProfile
);

userRoute.put(
  "/:id",
  upload.single("profileImage"),
  userValidation.validateUserProfileUpdate,
  authenticateUser,
  authorizeUser,
  userController.updateUserProfile
);

export default userRoute;
