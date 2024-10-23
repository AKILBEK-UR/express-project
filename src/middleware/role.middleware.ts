import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRole = req.user?.role;
        if (!allowedRoles.includes(userRole)) throw new Error('Access denied');

        next();
    };
};