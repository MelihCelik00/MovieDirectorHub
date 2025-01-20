import { Request, Response } from 'express';
import { MovieService } from '../services/movie.service';
import { RequestHandler, parsePaginationQuery } from '../../shared/types/controller.types';
import { ValidationError } from '../../../utils/errors';

export class MovieController {
  constructor(private readonly service: MovieService) {}

  createMovie: RequestHandler = async (req: Request, res: Response) => {
    const movie = await this.service.createMovie(req.body);
    res.status(201).json(movie);
  };

  getMovieById: RequestHandler = async (req: Request, res: Response) => {
    const movie = await this.service.getMovieById(req.params.id);
    res.json(movie);
  };

  getAllMovies: RequestHandler = async (req: Request, res: Response) => {
    const { page, limit, sort } = parsePaginationQuery(req.query);
    const sortBy = sort ? Object.keys(sort)[0] : undefined;
    const sortOrder = sort ? (sort[Object.keys(sort)[0]] === 1 ? 'asc' : 'desc') : 'asc';
    const movies = await this.service.getAllMovies(page, limit, sortBy, sortOrder);
    res.json(movies);
  };

  updateMovie: RequestHandler = async (req: Request, res: Response) => {
    const movie = await this.service.updateMovie(req.params.id, req.body);
    res.json(movie);
  };

  deleteMovie: RequestHandler = async (req: Request, res: Response) => {
    await this.service.deleteMovie(req.params.id);
    res.status(204).send();
  };

  getMoviesByDirector: RequestHandler = async (req: Request, res: Response) => {
    const movies = await this.service.getMoviesByDirector(req.params.directorId);
    res.json(movies);
  };

  getMovieByImdbId: RequestHandler = async (req: Request, res: Response) => {
    const { imdbId } = req.params;
    
    if (!imdbId) {
      throw new ValidationError('IMDB ID is required');
    }

    const movie = await this.service.getMovieByImdbId(imdbId);
    if (!movie) {
      res.status(404).json({ message: `Movie with IMDB ID ${imdbId} not found` });
      return;
    }
    res.json(movie);
  };

  getMoviesByGenre: RequestHandler = async (req: Request, res: Response) => {
    const { genre } = req.query;
    
    if (!genre) {
      throw new ValidationError('Genre is required');
    }

    const movies = await this.service.getMoviesByGenre(genre as string);
    res.json(movies);
  };

  getMoviesByReleaseYearRange: RequestHandler = async (req: Request, res: Response) => {
    const { from, to } = req.query;
    
    if (!from || !to) {
      throw new ValidationError('From date and to date are required');
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(from as string) || !dateRegex.test(to as string)) {
      throw new ValidationError('Dates must be in YYYY-MM-DD format');
    }

    // Validate date values
    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);
    
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new ValidationError('Invalid date values provided');
    }

    const movies = await this.service.getMoviesByReleaseYearRange(fromDate, toDate);
    res.json(movies);
  };

  getMoviesByRatingRange: RequestHandler = async (req: Request, res: Response) => {
    const { min, max } = req.query;
    
    if (!min || !max) {
      throw new ValidationError('Minimum and maximum ratings are required');
    }

    const minRating = parseFloat(min as string);
    const maxRating = parseFloat(max as string);

    if (isNaN(minRating) || isNaN(maxRating)) {
      throw new ValidationError('Invalid rating values provided');
    }

    const movies = await this.service.getMoviesByRatingRange(minRating, maxRating);
    res.json(movies);
  };
} 