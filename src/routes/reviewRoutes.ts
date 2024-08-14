import express from "express";
import reviewController from "../controllers/reviewController";

const reviewRoute = express.Router();

reviewRoute.post("/", reviewController.addReview);

export default reviewRoute;
