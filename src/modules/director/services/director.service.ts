import { Types, Document } from 'mongoose';
import { DirectorRepository } from '../repositories/director.repository';
import { directorSchema, IDirector } from '../models/director.model';
import { NotFoundError, ValidationError } from '../../../utils/errors';
import { PaginatedResult, PaginationOptions } from '../../shared/repositories/base.repository';

export class DirectorService {
  private repository: DirectorRepository;

  constructor() {
    this.repository = new DirectorRepository();
  }

  async createDirector(data: Omit<IDirector, keyof Document>): Promise<IDirector> {
    const validatedData = directorSchema.parse(data);
    return this.repository.create(validatedData);
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

  async getAllDirectors(options: PaginationOptions): Promise<PaginatedResult<IDirector>> {
    return this.repository.findWithPagination({}, options);
  }

  async updateDirector(
    id: string,
    data: Partial<Omit<IDirector, keyof Document>>
  ): Promise<IDirector> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid director ID format');
    }

    // Validate the update data
    const validatedData = directorSchema.partial().parse(data);

    const updatedDirector = await this.repository.update(id, validatedData);
    if (!updatedDirector) {
      throw new NotFoundError(`Director with ID ${id} not found`);
    }

    return updatedDirector;
  }

  async deleteDirector(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid director ID format');
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Director with ID ${id} not found`);
    }
  }

  async findDirectorsByDateRange(startDate: Date, endDate: Date): Promise<IDirector[]> {
    if (startDate > endDate) {
      throw new ValidationError('Start date must be before end date');
    }

    return this.repository.findByBirthDateRange(startDate, endDate);
  }

  async findDirectorByName(firstName: string, lastName: string): Promise<IDirector | null> {
    return this.repository.findByName(firstName, lastName);
  }
} 