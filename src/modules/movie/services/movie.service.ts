import { Types, Document } from 'mongoose';
import { MovieRepository } from '../repositories/movie.repository';
import { movieSchema, IMovie } from '../models/movie.model';
import { NotFoundError, ValidationError } from '../../../utils/errors';
import { PaginatedResult, PaginationOptions } from '../../shared/repositories/base.repository';
import { DirectorService } from '../../director/services/director.service';

export class MovieService {
  private repository: MovieRepository;
  private directorService: DirectorService;

  constructor() {
    this.repository = new MovieRepository();
    this.directorService = new DirectorService();
  }

  async createMovie(data: Omit<IMovie, keyof Document>): Promise<IMovie> {
    // Validate director exists
    await this.directorService.getDirectorById(data.directorId.toString());

    const validatedData = movieSchema.parse(data);
    return this.repository.create(validatedData);
  }

  async getMovieById(id: string): Promise<IMovie> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid movie ID format');
    }

    const movie = await this.repository.findById(id);
    if (!movie) {
      throw new NotFoundError(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async getAllMovies(options: PaginationOptions): Promise<PaginatedResult<IMovie>> {
    return this.repository.findWithPagination({}, options);
  }

  async updateMovie(
    id: string,
    data: Partial<Omit<IMovie, keyof Document>>
  ): Promise<IMovie> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid movie ID format');
    }

    // If directorId is being updated, validate the new director exists
    if (data.directorId) {
      await this.directorService.getDirectorById(data.directorId.toString());
    }

    // Validate the update data
    const validatedData = movieSchema.partial().parse(data);

    const updatedMovie = await this.repository.update(id, validatedData);
    if (!updatedMovie) {
      throw new NotFoundError(`Movie with ID ${id} not found`);
    }

    return updatedMovie;
  }

  async deleteMovie(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid movie ID format');
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Movie with ID ${id} not found`);
    }
  }

  async getMoviesByDirector(directorId: string): Promise<IMovie[]> {
    if (!Types.ObjectId.isValid(directorId)) {
      throw new ValidationError('Invalid director ID format');
    }

    // Validate director exists
    await this.directorService.getDirectorById(directorId);

    return this.repository.findByDirector(directorId);
  }

  async getMovieByImdbId(imdbId: string): Promise<IMovie | null> {
    return this.repository.findByImdbId(imdbId);
  }

  async getMoviesByGenre(genre: string): Promise<IMovie[]> {
    return this.repository.findByGenre(genre);
  }

  async getMoviesByReleaseYearRange(startYear: number, endYear: number): Promise<IMovie[]> {
    if (startYear > endYear) {
      throw new ValidationError('Start year must be before end year');
    }

    return this.repository.findByReleaseYearRange(startYear, endYear);
  }

  async getMoviesByRatingRange(minRating: number, maxRating: number): Promise<IMovie[]> {
    if (minRating < 0 || maxRating > 10) {
      throw new ValidationError('Rating must be between 0 and 10');
    }

    if (minRating > maxRating) {
      throw new ValidationError('Minimum rating must be less than or equal to maximum rating');
    }

    return this.repository.findByRatingRange(minRating, maxRating);
  }
} 