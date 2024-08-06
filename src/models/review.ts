import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
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

const ratingModel = mongoose.model("rating", ratingSchema);

export default ratingModel;
