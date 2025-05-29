import type { Request, Response, NextFunction } from 'express';

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: 'NotAuthenticated', message: 'User not authenticated' });
    return;
  }

  next();
};

export const ownerOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ error: 'NotAuthenticated', message: 'User not authenticated' });
    return;
  }

  if (req.user.id !== Number(req.params.id)) {
    res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
    return;
  }

  next();
};

export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error('Error handler middleware:', error);

  res.status(500).json({ error: 'InternalServerError', message: 'Internal Server Error' }).end();
};
