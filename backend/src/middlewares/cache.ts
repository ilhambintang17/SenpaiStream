
import type { Request, Response, NextFunction } from 'express';

// Simple bypass for now since we removed Redis
export const clientCache = (duration: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  };
};

export const serverCache = (duration: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  };
};
