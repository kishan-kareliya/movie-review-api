import express from "express";
import authentication from "../middlewares/authentication";
import userController from "../controllers/userController";
import userAuthorization from "../middlewares/authorization";
import multer from "multer";
import path from "node:path";
import userValidation from "../middlewares/userValidation";

const userRoute = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/users/profileImage"),
});

userRoute.get(
  "/:id",
  authentication,
  userAuthorization,
  userController.getUserProfile
);

userRoute.put(
  "/:id",
  upload.single("profileImage"),
  authentication,
  userAuthorization,
  userValidation.validateUserProfileUpdate,
  userController.updateUserProfile
);

export default userRoute;
