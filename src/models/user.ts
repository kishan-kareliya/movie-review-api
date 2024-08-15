import mongoose from "mongoose";
import UserType from "../types/userType";

const userSchema = new mongoose.Schema<UserType>(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false, // Default to false for regular users
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
