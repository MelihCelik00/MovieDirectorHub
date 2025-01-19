import { Model } from 'mongoose';
import { MongoDBRepository } from '../../shared/repositories/mongodb.repository';
import { IDirector, DirectorModel } from '../models/director.model';

export class DirectorRepository extends MongoDBRepository<IDirector> {
  constructor(model: Model<IDirector> = DirectorModel) {
    super(model);
  }

  async findByName(firstName?: string, lastName?: string): Promise<IDirector[]> {
    const query: any = {};
    
    if (firstName) {
      query.firstName = new RegExp(firstName, 'i');
    }
    if (lastName) {
      query.lastName = new RegExp(lastName, 'i');
    }

    return this.find(query);
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