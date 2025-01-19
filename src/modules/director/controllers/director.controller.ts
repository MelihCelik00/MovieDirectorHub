import { Request, Response } from 'express';
import { DirectorService } from '../services/director.service';
import { RequestHandler, parsePaginationQuery } from '../../shared/types/controller.types';
import { ValidationError } from '../../../utils/errors';

export class DirectorController {
  private service: DirectorService;

  constructor() {
    this.service = new DirectorService();
  }

  createDirector: RequestHandler = async (req: Request, res: Response) => {
    const director = await this.service.createDirector(req.body);
    res.status(201).json(director);
  };

  getDirectorById: RequestHandler = async (req: Request, res: Response) => {
    const director = await this.service.getDirectorById(req.params.id);
    res.json(director);
  };

  getAllDirectors: RequestHandler = async (req: Request, res: Response) => {
    const paginationOptions = parsePaginationQuery(req.query);
    const directors = await this.service.getAllDirectors(paginationOptions);
    res.json(directors);
  };

  updateDirector: RequestHandler = async (req: Request, res: Response) => {
    const director = await this.service.updateDirector(req.params.id, req.body);
    res.json(director);
  };

  deleteDirector: RequestHandler = async (req: Request, res: Response) => {
    await this.service.deleteDirector(req.params.id);
    res.status(204).send();
  };

  findDirectorsByDateRange: RequestHandler = async (req: Request, res: Response) => {
    const { from, to } = req.query;
    
    if (!from || !to) {
      throw new ValidationError('From date and to date are required');
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(from as string) || !dateRegex.test(to as string)) {
      throw new ValidationError('Dates must be in YYYY-MM-DD format');
    }

    // Validate date values
    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);
    
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new ValidationError('Invalid date values provided');
    }

    const directors = await this.service.findDirectorsByDateRange(fromDate, toDate);
    res.json(directors);
  };

  findDirectorByName: RequestHandler = async (req: Request, res: Response) => {
    const { firstName, lastName } = req.query;
    
    if (!firstName || !lastName) {
      throw new ValidationError('First name and last name are required');
    }

    const director = await this.service.findDirectorByName(
      firstName as string,
      lastName as string
    );
    res.json(director);
  };
} 