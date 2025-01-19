import { Request, Response } from 'express';
import { DirectorRepository } from '../repositories/director.repository';

export class DirectorController {
  private repository: DirectorRepository;

  constructor(repository: DirectorRepository = new DirectorRepository()) {
    this.repository = repository;
  }

  createDirector = async (req: Request, res: Response): Promise<void> => {
    try {
      const director = await this.repository.create(req.body);
      res.status(201).json({
        status: 'success',
        code: 201,
        message: 'Director created successfully',
        data: director,
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Failed to create director',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    }
  };

  getAllDirectors = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as string) || 'desc';

      const { directors, total } = await this.repository.findAll(page, limit, sortBy, sortOrder);
      
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Directors retrieved successfully',
        data: {
          directors,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Failed to retrieve directors',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    }
  };

  getDirectorById = async (req: Request, res: Response): Promise<void> => {
    try {
      const director = await this.repository.findById(req.params.id);
      if (!director) {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Director not found',
          timestamp: new Date().toISOString(),
          path: req.path,
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Director retrieved successfully',
        data: director,
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Failed to retrieve director',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    }
  };

  updateDirector = async (req: Request, res: Response): Promise<void> => {
    try {
      const director = await this.repository.update(req.params.id, req.body);
      if (!director) {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Director not found',
          timestamp: new Date().toISOString(),
          path: req.path,
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Director updated successfully',
        data: director,
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Failed to update director',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    }
  };

  deleteDirector = async (req: Request, res: Response): Promise<void> => {
    try {
      const success = await this.repository.delete(req.params.id);
      if (!success) {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Director not found',
          timestamp: new Date().toISOString(),
          path: req.path,
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Failed to delete director',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    }
  };

  searchDirectors = async (req: Request, res: Response): Promise<void> => {
    try {
      const name = req.query.name as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { directors, total } = await this.repository.findByName(name, page, limit);
      
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Directors retrieved successfully',
        data: {
          directors,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Failed to search directors',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    }
  };
} 