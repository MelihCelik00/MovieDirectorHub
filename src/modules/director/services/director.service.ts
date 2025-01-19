import { Types } from 'mongoose';
import { DirectorRepository } from '../repositories/director.repository';
import { directorSchema, IDirector } from '../models/director.model';
import { NotFoundError, ValidationError } from '../../../utils/errors';
import { PaginationOptions } from '../../shared/repositories/base.repository';
import { z } from 'zod';

export class DirectorService {
  constructor(
    private readonly repository: DirectorRepository
  ) {}

  async getAllDirectors(page: number = 1, limit: number = 10, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc') {
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

  async createDirector(data: z.infer<typeof directorSchema>): Promise<IDirector> {
    try {
      const validatedData = directorSchema.parse(data);
      return this.repository.create(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
        throw new ValidationError(`Validation failed: ${issues}`);
      }
      throw error;
    }
  }

  async getDirectorById(id: string): Promise<IDirector> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid director ID format');
    }

    const director = await this.repository.findById(id);
    if (!director) {
      throw new NotFoundError(`Director with ID ${id} not found`);
    }

    return director;
  }

  async updateDirector(id: string, data: Partial<z.infer<typeof directorSchema>>): Promise<IDirector> {
    try {
      const validatedData = directorSchema.partial().parse(data);
      const director = await this.repository.update(id, validatedData);
      
      if (!director) {
        throw new NotFoundError(`Director with ID ${id} not found`);
      }

      return director;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
        throw new ValidationError(`Validation failed: ${issues}`);
      }
      throw error;
    }
  }

  async deleteDirector(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    
    if (!deleted) {
      throw new NotFoundError(`Director with ID ${id} not found`);
    }
  }

  async findDirectorsByDateRange(fromDate: Date, toDate: Date): Promise<IDirector[]> {
    if (fromDate > toDate) {
      throw new ValidationError('Start date must be before end date');
    }

    return this.repository.findByBirthDateRange(fromDate, toDate);
  }

  async findDirectorByName(firstName?: string, lastName?: string): Promise<IDirector[]> {
    if (!firstName && !lastName) {
      throw new ValidationError('At least one of firstName or lastName must be provided');
    }

    return this.repository.findByName(firstName || '', lastName || '');
  }
}

export default DirectorService; 