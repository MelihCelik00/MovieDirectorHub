import { MovieController } from './controllers/movie.controller';
import { MovieService } from './services/movie.service';
import { MovieRepository } from './repositories/movie.repository';
import { MovieModel } from './models/movie.model';
import { DirectorFactory } from '../director/director.factory';

export class MovieFactory {
  private static repository: MovieRepository;
  private static service: MovieService;
  private static controller: MovieController;

  static getRepository(): MovieRepository {
    if (!this.repository) {
      this.repository = new MovieRepository(MovieModel);
    }
    return this.repository;
  }

  static getService(): MovieService {
    if (!this.service) {
      const repository = this.getRepository();
      const directorService = DirectorFactory.getService();
      this.service = new MovieService(repository, directorService);
    }
    return this.service;
  }

  static getController(): MovieController {
    if (!this.controller) {
      const service = this.getService();
      this.controller = new MovieController(service);
    }
    return this.controller;
  }
} 