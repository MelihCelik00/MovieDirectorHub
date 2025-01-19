import { Model, FilterQuery, UpdateQuery, Document } from 'mongoose';
import {
  AdvancedRepository,
  PaginatedResult,
  PaginationOptions,
} from './base.repository';
import { DatabaseError } from '../../../utils/errors';

export class MongoDBRepository<T extends Document> implements AdvancedRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      throw new DatabaseError('Error creating document', undefined, error);
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new DatabaseError('Error finding document by ID', undefined, error);
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter);
    } catch (error) {
      throw new DatabaseError('Error finding document', undefined, error);
    }
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    try {
      return await this.model.find(filter);
    } catch (error) {
      throw new DatabaseError('Error finding documents', undefined, error);
    }
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new DatabaseError('Error updating document', undefined, error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new DatabaseError('Error deleting document', undefined, error);
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      return await this.model.exists(filter) !== null;
    } catch (error) {
      throw new DatabaseError('Error checking document existence', undefined, error);
    }
  }

  async findWithPagination(
    filter: FilterQuery<T>,
    options: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    try {
      const page = Math.max(1, options.page || 1);
      const limit = Math.max(1, Math.min(options.limit || 10, 100));
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.model
          .find(filter)
          .sort(options.sort || { _id: -1 })
          .skip(skip)
          .limit(limit),
        this.model.countDocuments(filter),
      ]);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new DatabaseError(
        'Error finding documents with pagination',
        undefined,
        error
      );
    }
  }
} 