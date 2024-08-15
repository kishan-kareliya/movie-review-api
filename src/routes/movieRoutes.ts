import express from "express";
import movieController from "../controllers/movieController";
import multer from "multer";
import path from "node:path";
import movieValidation from "../middlewares/movieValidation";
import authenticateUser from "../middlewares/authenticateUser";
import authorizeAdmin from "../middlewares/authorizeAdmin";

const movieRoute = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/movies/images"),
});

movieRoute.post(
  "/",
  upload.single("coverImage"),
  authenticateUser,
  authorizeAdmin,
  movieValidation.validateAddMovie,
  movieController.addMovie
);

movieRoute.get("/", movieController.getMovies);

movieRoute.get("/search", movieController.searchMovies);

movieRoute.get("/filter", movieController.filterMovies);

movieRoute.put(
  "/:id",
  upload.single("coverImage"),
  authenticateUser,
  authorizeAdmin,
  movieValidation.validateUpdateMovie,
  movieController.updateMovie
);

movieRoute.get("/:id", movieController.getMovieById);

movieRoute.delete(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  movieController.deleteMovie
);

export default movieRoute;
