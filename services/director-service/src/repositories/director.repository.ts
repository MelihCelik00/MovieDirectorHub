import { FilterQuery } from 'mongoose';
import { Director } from '@movie-director-hub/shared';
import { DirectorModel, DirectorDocument } from '../models/director.model';

export class DirectorRepository {
  async create(data: Omit<Director, '_id' | 'createdAt' | 'updatedAt'>): Promise<Director> {
    const director = await DirectorModel.create(data);
    return director.toJSON();
  }

  async findById(id: string): Promise<Director | null> {
    const director = await DirectorModel.findById(id);
    return director ? director.toJSON() : null;
  }

  async update(id: string, data: Partial<Omit<Director, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Director | null> {
    const director = await DirectorModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    return director ? director.toJSON() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await DirectorModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async findAll(
    page: number,
    limit: number,
    sortBy: keyof Director = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ directors: Director[]; total: number }> {
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [directors, total] = await Promise.all([
      DirectorModel.find()
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      DirectorModel.countDocuments(),
    ]);

    return {
      directors: directors.map(director => director.toJSON()),
      total,
    };
  }

  async findByName(
    name: string,
    page: number,
    limit: number
  ): Promise<{ directors: Director[]; total: number }> {
    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(name, 'i');
    const query: FilterQuery<DirectorDocument> = {
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
      ],
    };

    const [directors, total] = await Promise.all([
      DirectorModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      DirectorModel.countDocuments(query),
    ]);

    return {
      directors: directors.map(director => director.toJSON()),
      total,
    };
  }

  async exists(id: string): Promise<boolean> {
    const count = await DirectorModel.countDocuments({ _id: id });
    return count > 0;
  }
} 