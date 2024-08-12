import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import movieRoutes from "./routes/movieRoutes";
import errorHandler from "./middlewares/globalErrorHandler";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_DOMAIN,
  })
);

app.get("/", (req, res) => {
  res.send("welcome to movie review api");
});

app.use("/api/auth/", authRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/movies/", movieRoutes);

//global error handler
app.use(errorHandler);

export default app;
