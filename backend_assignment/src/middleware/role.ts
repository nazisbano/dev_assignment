import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    [key: string]: any;
  };
}

export const checkAdminRole = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
  try {
    const getRoles = 'https://yourapp.com/roles';
    const roles: string[] = req.user?.[getRoles] || [];

    if (roles.includes('admin')) {
      return next();
    }

    return res.status(403).json({ message: 'Admin access required' });
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
