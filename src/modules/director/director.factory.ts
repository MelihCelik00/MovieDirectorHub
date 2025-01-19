import { DirectorController } from './controllers/director.controller';
import { DirectorService } from './services/director.service';
import { DirectorRepository } from './repositories/director.repository';
import { DirectorModel } from './models/director.model';

export class DirectorFactory {
  private static repository: DirectorRepository;
  private static service: DirectorService;
  private static controller: DirectorController;

  static getRepository(): DirectorRepository {
    if (!this.repository) {
      this.repository = new DirectorRepository(DirectorModel);
    }
    return this.repository;
  }

  static getService(): DirectorService {
    if (!this.service) {
      const repository = this.getRepository();
      this.service = new DirectorService(repository);
    }
    return this.service;
  }

  static getController(): DirectorController {
    if (!this.controller) {
      const service = this.getService();
      this.controller = new DirectorController(service);
    }
    return this.controller;
  }
} 