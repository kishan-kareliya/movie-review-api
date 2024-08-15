import mongoose from "mongoose";
import ReviewType from "../types/reviewType";

const reviewSchema = new mongoose.Schema<ReviewType>({
  movieId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    trim: true,
    required: true,
  },
});

const reviewModel = mongoose.model("rating", reviewSchema);

export default reviewModel;
