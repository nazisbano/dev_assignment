// src/controllers/developer_controller.ts

import { Request, Response, NextFunction } from 'express';
import Developer, { IDeveloper } from '../models/developer_model';
import {fetchDevelopers} from '../services/developer_service';

// Extend Express Request to include Auth0 user info
interface AuthRequest extends Request {
  user?: { sub: string };
}

// @desc    Get all developers with filters, search, pagination
// @route   GET /api/developers
// @access  Public
export const getDevelopers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters = {
      skill: req.query.skill as string,
      location: req.query.location as string,
      search: req.query.search as string,
    };

    const pagination = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const data = await fetchDevelopers(filters, pagination);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new developer
// @route   POST /api/developers
// @access  Private (authenticated)
export const createDeveloper = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: Missing user ID' });
      return;
    }

    const developerData = { ...req.body, userId };
    const newDeveloper = await Developer.create(developerData);

    res.status(201).json(newDeveloper);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a developer (only by owner)
// @route   PUT /api/developers/:id
// @access  Private (owner only)
export const updateDeveloper = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const developer = await Developer.findById(req.params.id);
    if (!developer) {
      res.status(404).json({ message: 'Developer not found' });
      return;
    }

    if (developer.userId !== req.user?.sub) {
      res.status(403).json({ message: 'Forbidden: Not your resource' });
      return;
    }

    Object.assign(developer, req.body);
    await developer.save();

    res.status(200).json(developer);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a developer (only by owner or admin if logic added)
// @route   DELETE /api/developers/:id
// @access  Private (owner only or admin)
export const deleteDeveloper = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const developer = await Developer.findById(req.params.id);
    if (!developer) {
      res.status(404).json({ message: 'Developer not found' });
      return;
    }

    if (developer.userId !== req.user?.sub) {
      res.status(403).json({ message: 'Forbidden: Not your resource' });
      return;
    }

    await developer.deleteOne();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
