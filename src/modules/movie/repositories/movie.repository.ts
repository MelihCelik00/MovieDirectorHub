import { Types } from 'mongoose';
import { MongoDBRepository } from '../../shared/repositories/mongodb.repository';
import { IMovie, MovieModel } from '../models/movie.model';

export class MovieRepository extends MongoDBRepository<IMovie> {
  constructor(model = MovieModel) {
    super(model);
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

  async findByReleaseDateRange(fromDate: Date, toDate: Date): Promise<IMovie[]> {
    return this.find({
      releaseDate: {
        $gte: fromDate,
        $lte: toDate
      }
    });
  }

  async findByRatingRange(minRating: number, maxRating: number): Promise<IMovie[]> {
    return this.find({
      rating: {
        $gte: minRating,
        $lte: maxRating
      }
    });
  }
} 