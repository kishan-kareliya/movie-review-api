import express from "express";
import authController from "../controllers/authController";

const authenticationRoute = express.Router();

authenticationRoute.post("/register", authController.register);
authenticationRoute.post("/login", authController.login);

export default authenticationRoute;
