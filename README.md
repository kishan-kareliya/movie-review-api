# Movie Review API

A comprehensive backend API for managing user authentication, profiles, movies, and reviews. Built using Express.js, Node.js, MongoDB, Multer, Cloudinary, JWT, Zod, and TypeScript.

## Technologies Used

- **Backend:** Express.js, Node.js, TypeScript
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **File Upload:** Multer for local storage, Cloudinary for cloud storage
- **Validation:** Zod

## Database Schema

### Models

- **User:** `{ username, email, password, profileImage, isAdmin }`
- **Movie:** `{ title, genre, director, releaseDate, description, coverImage }`
- **Review:** `{ movieId, userId, rating, comment }`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Log in a user.

### User

- `GET /api/users/:id` - Get user profile.
- `PUT /api/users/:id` - Update user profile.

### Movies

- `GET /api/movies` - Get a list of movies.
- `GET /api/movies/:id` - Get movie details.
- `POST /api/movies` - Add a new movie (admin only).
- `PUT /api/movies/:id` - Update movie information (admin only).
- `DELETE /api/movies/:id` - Delete a movie (admin only).
- `GET /api/movies/search` - Search movies by title or director.
- `GET /api/movies/filter` - Filter movies by genre or release date.

### Reviews

- `POST /api/reviews` - Add a review.
- `PUT /api/reviews/:id` - Edit a review.
- `DELETE /api/reviews/:id` - Delete a review.

## Project Structure

    src/
    |
    ├── config/
    │ ├── cloudinary.ts # Cloudinary service configuration
    │ └── db.ts # MongoDB connection setup
    |
    ├── controllers/
    │ ├── authController.ts # Handle registration and login
    │ ├── movieController.ts # Handle CRUD operations for movies
    │ ├── reviewController.ts # Handle CRUD operations for reviews
    │ └── userController.ts # Handle user profile operations
    |
    ├── middlewares/
    │ ├── authenticateUser.ts # Check and verify JWT token
    │ ├── authorizeAdmin.ts # Ensure the user is an admin
    │ ├── authorizeUser.ts # Check if the user is authorized to access a resource
    │ ├── globalErrorHandler.ts # Global error handling middleware
    │ ├── movieValidation.ts # Zod validation for movie operations
    │ ├── reviewValidation.ts # Zod validation for review operations
    │ └── userValidation.ts # Zod validation for user operations
    |
    ├── models/
    │ ├── movie.ts # Movie model schema
    │ ├── review.ts # Review model schema
    │ └── user.ts # User model schema
    |
    ├── routes/
    │ ├── authRoutes.ts # Authentication routes
    │ ├── movieRoutes.ts # Movie management routes
    │ ├── reviewRoutes.ts # Review management routes
    │ └── userRoutes.ts # User profile routes
    |
    ├── types/
    │ ├── movieTypes.ts # Type definitions for movie data
    │ ├── reviewTypes.ts # Type definitions for review data
    │ └── userTypes.ts # Type definitions for user data
    |
    ├── utils/
    │ └── deleteFile.ts # Utility for deleting images from specific paths
    |
    └── app.ts # Main application setup and configuration
