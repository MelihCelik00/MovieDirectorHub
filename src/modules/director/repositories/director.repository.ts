import { Model } from 'mongoose';
import { MongoDBRepository } from '../../shared/repositories/mongodb.repository';
import { IDirector, DirectorModel } from '../models/director.model';

export class DirectorRepository extends MongoDBRepository<IDirector> {
  constructor(model: Model<IDirector> = DirectorModel) {
    super(model);
  }

  async findByName(firstName: string, lastName: string): Promise<IDirector | null> {
    return this.findOne({ firstName, lastName });
  }

  async findByBirthDateRange(startDate: Date, endDate: Date): Promise<IDirector[]> {
    return this.find({
      birthDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });
  }
} 