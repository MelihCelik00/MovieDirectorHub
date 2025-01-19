import { Types, Document } from 'mongoose';
import { MovieRepository } from '../repositories/movie.repository';
import { movieSchema, IMovie } from '../models/movie.model';
import { NotFoundError, ValidationError } from '../../../utils/errors';
import { PaginatedResult, PaginationOptions } from '../../shared/repositories/base.repository';
import { DirectorService } from '../../director/services/director.service';
import { z } from 'zod';

export class MovieService {
  constructor(
    private readonly repository: MovieRepository,
    private readonly directorService: DirectorService
  ) {}

  async createMovie(data: Omit<IMovie, keyof Document>): Promise<IMovie> {
    try {
      // Validate director exists first
      await this.directorService.getDirectorById(data.directorId.toString());

      // Coerce rating to number if it's a string
      if (typeof data.rating === 'string') {
        data.rating = parseFloat(data.rating);
      }

      const validatedData = movieSchema.parse(data);
      return this.repository.create(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
        throw new ValidationError(`Validation failed: ${issues}`);
      }
      throw error;
    }
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

    try {
      // Validate the update data
      const validatedData = movieSchema.partial().parse(data);

      const updatedMovie = await this.repository.update(id, validatedData);
      if (!updatedMovie) {
        throw new NotFoundError(`Movie with ID ${id} not found`);
      }

      return updatedMovie;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
        throw new ValidationError(`Validation failed: ${issues}`);
      }
      throw error;
    }
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

  async getMoviesByReleaseYearRange(fromDate: Date, toDate: Date): Promise<IMovie[]> {
    if (fromDate > toDate) {
      throw new ValidationError('Start date must be before end date');
    }

    return this.repository.findByReleaseDateRange(fromDate, toDate);
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