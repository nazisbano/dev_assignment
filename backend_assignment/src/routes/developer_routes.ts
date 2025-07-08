import { Router } from 'express';
import * as DeveloperController from '../controllers/developer_cotroller';
import { checkJwt } from '../middleware/auth';
import { checkAdminRole } from '../middleware/role';

const router = Router();

/**
 * @route   GET /api/developers
 * @desc    Get all developer profiles
 */
router.get('/', DeveloperController.getDevelopers);

/**
 * @route   POST /api/developers
 * @desc    Create a new developer profile
 */
router.post('/', checkJwt, DeveloperController.createDeveloper);

/**
 * @route   PUT /api/developers/:id
 * @desc    Update a developer profile by ID
 */
router.put('/:id', checkJwt, DeveloperController.updateDeveloper);

/**
 * @route   DELETE /api/developers/:id
 * @desc    Delete a developer profile by ID (admin only)
 */
router.delete('/:id', checkJwt, checkAdminRole, DeveloperController.deleteDeveloper);

export default router;
