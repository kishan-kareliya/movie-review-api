import express from "express";
import authentication from "../middlewares/authentication";
import userController from "../controllers/userController";

const userRoute = express.Router();

userRoute.get("/:id", authentication, userController.getUserProfile);

export default userRoute;
