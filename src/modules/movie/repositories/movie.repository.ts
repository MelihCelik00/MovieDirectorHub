import { Types } from 'mongoose';
import { MongoDBRepository } from '../../shared/repositories/mongodb.repository';
import { IMovie, MovieModel } from '../models/movie.model';

export class MovieRepository extends MongoDBRepository<IMovie> {
  constructor() {
    super(MovieModel);
  }

  async findByDirector(directorId: string): Promise<IMovie[]> {
    return this.find({ directorId: new Types.ObjectId(directorId) });
  }

  async findByImdbId(imdbId: string): Promise<IMovie | null> {
    return this.findOne({ imdbId });
  }

  async findByGenre(genre: string): Promise<IMovie[]> {
    return this.find({ genre });
  }

  async findByReleaseYearRange(startYear: number, endYear: number): Promise<IMovie[]> {
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31);
    
    return this.find({
      releaseDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });
  }

  async findByRatingRange(minRating: number, maxRating: number): Promise<IMovie[]> {
    return this.find({
      rating: {
        $gte: minRating,
        $lte: maxRating,
      },
    });
  }
} 