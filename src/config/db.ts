import mongoose from "mongoose";
import { config } from "dotenv";

config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    console.log("database connected successfully!");
  } catch (error) {
    console.log("Failed to connect to the database");
  }
};

export default connectDb;
