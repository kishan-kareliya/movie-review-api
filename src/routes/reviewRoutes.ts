import express from "express";
import reviewController from "../controllers/reviewController";
import reviewValidation from "../middlewares/reviewValidation";
import authenticateUser from "../middlewares/authenticateUser";

const reviewRoute = express.Router();

reviewRoute.post(
  "/",
  authenticateUser,
  reviewValidation.addReviewValidation,
  reviewController.addReview
);

reviewRoute.put(
  "/:id",
  authenticateUser,
  reviewValidation.updateReviewValidation,
  reviewController.updateReview
);

export default reviewRoute;
