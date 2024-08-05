import express from "express";
import app from "./src/app";
import { config } from "dotenv";
import connectDb from "./src/config/db";

config();
const PORT = process.env.PORT;

const startServer = async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`Server listening Port: ${PORT}`);
  });
};

startServer();
