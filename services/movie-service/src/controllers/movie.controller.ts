import { Request, Response } from 'express';
import { MovieService } from '../services/movie.service';
import asyncHandler from 'express-async-handler';

/**
 * Movie Controller class for handling HTTP requests
 */
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  /**
   * Create a new movie
   */
  createMovie = asyncHandler(async (req: Request, res: Response) => {
    const movie = await this.movieService.createMovie(req.body);
    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Movie created successfully',
      timestamp: new Date().toISOString(),
      path: req.path,
      data: movie,
    });
  });

  /**
   * Get a movie by ID
   */
  getMovieById = asyncHandler(async (req: Request, res: Response) => {
    const movie = await this.movieService.getMovieById(req.params.id);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Movie retrieved successfully',
      timestamp: new Date().toISOString(),
      path: req.path,
      data: movie,
    });
  });

  /**
   * Get a movie by IMDB ID
   */
  getMovieByImdbId = asyncHandler(async (req: Request, res: Response) => {
    const movie = await this.movieService.getMovieByImdbId(req.params.imdbId);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Movie retrieved successfully',
      timestamp: new Date().toISOString(),
      path: req.path,
      data: movie,
    });
  });

  /**
   * Update a movie
   */
  updateMovie = asyncHandler(async (req: Request, res: Response) => {
    const movie = await this.movieService.updateMovie(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Movie updated successfully',
      timestamp: new Date().toISOString(),
      path: req.path,
      data: movie,
    });
  });

  /**
   * Delete a movie
   */
  deleteMovie = asyncHandler(async (req: Request, res: Response) => {
    const movie = await this.movieService.deleteMovie(req.params.id);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Movie deleted successfully',
      timestamp: new Date().toISOString(),
      path: req.path,
      data: movie,
    });
  });

  /**
   * Get all movies with pagination
   */
  getAllMovies = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.movieService.getAllMovies({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      sort: req.query.sort as string,
    });
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Movies retrieved successfully',
      timestamp: new Date().toISOString(),
      path: req.path,
      data: result,
    });
  });

  /**
   * Get movies by director ID
   */
  getMoviesByDirectorId = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.movieService.getMoviesByDirectorId(
      req.params.directorId,
      {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        sort: req.query.sort as string,
      }
    );
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Movies retrieved successfully',
      timestamp: new Date().toISOString(),
      path: req.path,
      data: result,
    });
  });

  /**
   * Get movies by genre
   */
  getMoviesByGenre = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.movieService.getMoviesByGenre(req.params.genre, {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      sort: req.query.sort as string,
    });
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Movies retrieved successfully',
      timestamp: new Date().toISOString(),
      path: req.path,
      data: result,
    });
  });
} 