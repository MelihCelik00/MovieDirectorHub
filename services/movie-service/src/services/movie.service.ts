import {
  PaginationParams,
  ValidationError,
  NotFoundError,
  ConflictError,
  CreateMovieSchema,
  CreateMovie,
} from '@movie-director-hub/shared';
import { Types } from 'mongoose';
import { MovieRepository } from '../repositories/movie.repository';

/**
 * Movie Service class for handling business logic
 */
export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  /**
   * Creates a new movie
   */
  async createMovie(movieData: CreateMovie) {
    // Validate movie data
    const validationResult = CreateMovieSchema.safeParse(movieData);
    if (!validationResult.success) {
      throw new ValidationError(
        'Invalid movie data',
        '/movies',
        validationResult.error
      );
    }

    // Check if movie with same IMDB ID exists
    const existingMovie = await this.movieRepository.findByImdbId(
      movieData.imdbId
    );
    if (existingMovie) {
      throw new ConflictError(
        `Movie with IMDB ID ${movieData.imdbId} already exists`,
        '/movies'
      );
    }

    // Transform the validated data for database
    const transformedData = {
      ...movieData,
      releaseDate: new Date(movieData.releaseDate),
      directorId: new Types.ObjectId(movieData.directorId),
    };

    return this.movieRepository.create(transformedData);
  }

  /**
   * Gets a movie by ID
   */
  async getMovieById(id: string) {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new NotFoundError(`Movie with ID ${id} not found`, '/movies');
    }
    return movie;
  }

  /**
   * Gets a movie by IMDB ID
   */
  async getMovieByImdbId(imdbId: string) {
    const movie = await this.movieRepository.findByImdbId(imdbId);
    if (!movie) {
      throw new NotFoundError(
        `Movie with IMDB ID ${imdbId} not found`,
        '/movies'
      );
    }
    return movie;
  }

  /**
   * Updates a movie
   */
  async updateMovie(id: string, updateData: Partial<CreateMovie>) {
    // Validate update data
    const validationResult = CreateMovieSchema.partial().safeParse(updateData);
    if (!validationResult.success) {
      throw new ValidationError(
        'Invalid update data',
        '/movies',
        validationResult.error
      );
    }

    // Check if movie exists
    const existingMovie = await this.movieRepository.findById(id);
    if (!existingMovie) {
      throw new NotFoundError(`Movie with ID ${id} not found`, '/movies');
    }

    // If IMDB ID is being updated, check for uniqueness
    if (updateData.imdbId && updateData.imdbId !== existingMovie.imdbId) {
      const movieWithImdbId = await this.movieRepository.findByImdbId(
        updateData.imdbId
      );
      if (movieWithImdbId) {
        throw new ConflictError(
          `Movie with IMDB ID ${updateData.imdbId} already exists`,
          '/movies'
        );
      }
    }

    // Transform the validated data for database
    const transformedData = {
      title: updateData.title,
      description: updateData.description,
      genre: updateData.genre,
      rating: updateData.rating,
      imdbId: updateData.imdbId,
      ...(updateData.releaseDate && { 
        releaseDate: new Date(updateData.releaseDate) 
      }),
      ...(updateData.directorId && { 
        directorId: new Types.ObjectId(updateData.directorId) 
      }),
    };

    return this.movieRepository.update(id, transformedData);
  }

  /**
   * Deletes a movie
   */
  async deleteMovie(id: string) {
    const movie = await this.movieRepository.delete(id);
    if (!movie) {
      throw new NotFoundError(`Movie with ID ${id} not found`, '/movies');
    }
    return movie;
  }

  /**
   * Gets all movies with pagination
   */
  async getAllMovies(params: PaginationParams = {}) {
    const { movies, total } = await this.movieRepository.findAll(params);
    return {
      movies,
      total,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: Math.ceil(total / (params.limit || 10)),
    };
  }

  /**
   * Gets movies by director ID
   */
  async getMoviesByDirectorId(directorId: string, params: PaginationParams = {}) {
    const { movies, total } = await this.movieRepository.findByDirectorId(
      directorId,
      params
    );
    return {
      movies,
      total,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: Math.ceil(total / (params.limit || 10)),
    };
  }

  /**
   * Gets movies by genre
   */
  async getMoviesByGenre(genre: string, params: PaginationParams = {}) {
    const { movies, total } = await this.movieRepository.findByGenre(
      genre,
      params
    );
    return {
      movies,
      total,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: Math.ceil(total / (params.limit || 10)),
    };
  }
} 