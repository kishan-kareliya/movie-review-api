import express from "express";
import movieController from "../controllers/movieController";
import multer from "multer";
import path from "node:path";
import movieValidation from "../middlewares/movieValidation";

const movieRoute = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/movies/images"),
});

movieRoute.post(
  "/",
  upload.single("coverImage"),
  movieValidation.validateAddMovie,
  movieController.addMovie
);

movieRoute.get("/", movieController.getMovies);

movieRoute.get("/:id", movieController.getMovieById);

movieRoute.delete("/:id", movieController.deleteMovie);

export default movieRoute;
