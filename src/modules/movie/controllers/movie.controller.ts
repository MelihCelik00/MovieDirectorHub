import { Request, Response } from 'express';
import { MovieService } from '../services/movie.service';
import { RequestHandler, parsePaginationQuery } from '../../shared/types/controller.types';
import { ValidationError } from '../../../utils/errors';

export class MovieController {
  private service: MovieService;

  constructor() {
    this.service = new MovieService();
  }

  createMovie: RequestHandler = async (req: Request, res: Response) => {
    const movie = await this.service.createMovie(req.body);
    res.status(201).json(movie);
  };

  getMovieById: RequestHandler = async (req: Request, res: Response) => {
    const movie = await this.service.getMovieById(req.params.id);
    res.json(movie);
  };

  getAllMovies: RequestHandler = async (req: Request, res: Response) => {
    const paginationOptions = parsePaginationQuery(req.query);
    const movies = await this.service.getAllMovies(paginationOptions);
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
    const { startYear, endYear } = req.query;
    
    if (!startYear || !endYear) {
      throw new ValidationError('Start year and end year are required');
    }

    const movies = await this.service.getMoviesByReleaseYearRange(
      parseInt(startYear as string, 10),
      parseInt(endYear as string, 10)
    );
    res.json(movies);
  };

  getMoviesByRatingRange: RequestHandler = async (req: Request, res: Response) => {
    const { minRating, maxRating } = req.query;
    
    if (!minRating || !maxRating) {
      throw new ValidationError('Minimum and maximum ratings are required');
    }

    const movies = await this.service.getMoviesByRatingRange(
      parseFloat(minRating as string),
      parseFloat(maxRating as string)
    );
    res.json(movies);
  };
} 