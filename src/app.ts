import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to movie review api");
});

export default app;
