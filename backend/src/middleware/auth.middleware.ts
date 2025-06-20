import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret') as { id: string };

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    logger.error('Token verification failed:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
