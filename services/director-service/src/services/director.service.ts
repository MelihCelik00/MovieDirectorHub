import {
  Director,
  PaginationParams,
  ValidationError,
  NotFoundError,
  DirectorSchema,
} from '@movie-director-hub/shared';
import { DirectorRepository } from '../repositories/director.repository';

/**
 * Director Service class for handling business logic
 */
export class DirectorService {
  constructor(private readonly directorRepository: DirectorRepository) {}

  /**
   * Creates a new director
   */
  async createDirector(directorData: Omit<Director, '_id'>) {
    // Validate director data
    const validationResult = DirectorSchema.safeParse(directorData);
    if (!validationResult.success) {
      throw new ValidationError(
        'Invalid director data',
        '/directors',
        validationResult.error
      );
    }

    return this.directorRepository.create(directorData);
  }

  /**
   * Gets a director by ID
   */
  async getDirectorById(id: string) {
    const director = await this.directorRepository.findById(id);
    if (!director) {
      throw new NotFoundError(`Director with ID ${id} not found`, '/directors');
    }
    return director;
  }

  /**
   * Updates a director
   */
  async updateDirector(id: string, updateData: Partial<Director>) {
    // Validate update data
    const validationResult = DirectorSchema.partial().safeParse(updateData);
    if (!validationResult.success) {
      throw new ValidationError(
        'Invalid update data',
        '/directors',
        validationResult.error
      );
    }

    // Check if director exists
    const existingDirector = await this.directorRepository.findById(id);
    if (!existingDirector) {
      throw new NotFoundError(`Director with ID ${id} not found`, '/directors');
    }

    return this.directorRepository.update(id, updateData);
  }

  /**
   * Deletes a director
   */
  async deleteDirector(id: string) {
    const director = await this.directorRepository.delete(id);
    if (!director) {
      throw new NotFoundError(`Director with ID ${id} not found`, '/directors');
    }
    return director;
  }

  /**
   * Gets all directors with pagination
   */
  async getAllDirectors(params: PaginationParams = {}) {
    const { directors, total } = await this.directorRepository.findAll(params);
    return {
      directors,
      total,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: Math.ceil(total / (params.limit || 10)),
    };
  }

  /**
   * Gets directors by name search
   */
  async getDirectorsByName(name: string, params: PaginationParams = {}) {
    const { directors, total } = await this.directorRepository.findByName(
      name,
      params
    );
    return {
      directors,
      total,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: Math.ceil(total / (params.limit || 10)),
    };
  }

  /**
   * Checks if a director exists
   */
  async directorExists(id: string): Promise<boolean> {
    return this.directorRepository.exists(id);
  }
} 