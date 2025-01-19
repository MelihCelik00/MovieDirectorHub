import { Types } from 'mongoose';
import { MovieRepository } from '../repositories/movie.repository';
import { movieSchema, IMovie } from '../models/movie.model';
import { NotFoundError, ValidationError } from '../../../utils/errors';
import { DirectorService } from '../../director/services/director.service';
import { PaginationOptions } from '../../shared/repositories/base.repository';
import { z } from 'zod';

export class MovieService {
  constructor(
    private readonly repository: MovieRepository,
    private readonly directorService: DirectorService
  ) {}

  async getAllMovies(page: number = 1, limit: number = 10, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc') {
    const options: PaginationOptions = {
      page,
      limit,
      sort: sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 as 1 | -1 } : undefined
    };

    const result = await this.repository.findWithPagination({}, options);
    
    return {
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }

  async createMovie(data: z.infer<typeof movieSchema>): Promise<IMovie> {
    try {
      await this.directorService.getDirectorById(data.directorId.toString());

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

  async updateMovie(id: string, data: Partial<z.infer<typeof movieSchema>>): Promise<IMovie> {
    try {
      if (data.directorId) {
        await this.directorService.getDirectorById(data.directorId.toString());
      }

      const validatedData = movieSchema.partial().parse(data);
      const movie = await this.repository.update(id, validatedData);
      
      if (!movie) {
        throw new NotFoundError(`Movie with ID ${id} not found`);
      }

      return movie;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
        throw new ValidationError(`Validation failed: ${issues}`);
      }
      throw error;
    }
  }

  async deleteMovie(id: string): Promise<void> {
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

export default MovieService; 