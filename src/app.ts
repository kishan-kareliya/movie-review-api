import express from "express";
import cors from "cors";
import authenticationRoute from "./routes/authenticationRouter";
import userRoute from "./routes/userRouter";
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

app.use("/api/auth/", authenticationRoute);
app.use("/api/users/", userRoute);

//global error handler
app.use(errorHandler);

export default app;
