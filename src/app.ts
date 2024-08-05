import express from "express";
import cors from "cors";
import authenticationRoute from "./routes/authentication";

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

export default app;
