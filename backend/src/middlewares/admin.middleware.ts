import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'ADMIN') {
    return res
      .status(403)
      .json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};
