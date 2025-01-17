import { Types } from 'mongoose';
import { Movie, PaginationParams } from '@movie-director-hub/shared';
import { MovieModel, MovieDocument } from '../models/movie.model';
import { calculateSkip, formatSortString } from '@movie-director-hub/shared';

/**
 * Movie Repository class for handling database operations
 */
export class MovieRepository {
  /**
   * Creates a new movie
   */
  async create(movieData: Omit<Movie, '_id'>): Promise<MovieDocument> {
    const movie = new MovieModel(movieData);
    return movie.save();
  }

  /**
   * Finds a movie by ID
   */
  async findById(id: string): Promise<MovieDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return MovieModel.findById(id);
  }

  /**
   * Finds a movie by IMDB ID
   */
  async findByImdbId(imdbId: string): Promise<MovieDocument | null> {
    return MovieModel.findOne({ imdbId });
  }

  /**
   * Updates a movie by ID
   */
  async update(
    id: string,
    updateData: Partial<Movie>
  ): Promise<MovieDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return MovieModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
  }

  /**
   * Deletes a movie by ID
   */
  async delete(id: string): Promise<MovieDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return MovieModel.findByIdAndDelete(id);
  }

  /**
   * Finds all movies with pagination
   */
  async findAll(params: PaginationParams = {}): Promise<{
    movies: MovieDocument[];
    total: number;
  }> {
    const { page = 1, limit = 10, sort = '-createdAt' } = params;
    const skip = calculateSkip(page, limit);
    const sortOptions = formatSortString(sort);

    const [movies, total] = await Promise.all([
      MovieModel.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      MovieModel.countDocuments(),
    ]);

    return { movies, total };
  }

  /**
   * Finds movies by director ID
   */
  async findByDirectorId(
    directorId: string,
    params: PaginationParams = {}
  ): Promise<{
    movies: MovieDocument[];
    total: number;
  }> {
    if (!Types.ObjectId.isValid(directorId)) {
      return { movies: [], total: 0 };
    }

    const { page = 1, limit = 10, sort = '-createdAt' } = params;
    const skip = calculateSkip(page, limit);
    const sortOptions = formatSortString(sort);

    const [movies, total] = await Promise.all([
      MovieModel.find({ directorId })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      MovieModel.countDocuments({ directorId }),
    ]);

    return { movies, total };
  }

  /**
   * Finds movies by genre
   */
  async findByGenre(
    genre: string,
    params: PaginationParams = {}
  ): Promise<{
    movies: MovieDocument[];
    total: number;
  }> {
    const { page = 1, limit = 10, sort = '-createdAt' } = params;
    const skip = calculateSkip(page, limit);
    const sortOptions = formatSortString(sort);

    const [movies, total] = await Promise.all([
      MovieModel.find({ genre })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      MovieModel.countDocuments({ genre }),
    ]);

    return { movies, total };
  }
} 