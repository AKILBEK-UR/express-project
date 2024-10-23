import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
    userId: string;
    role: 'admin' | 'user';
}

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                role: 'admin' | 'user';
            };
        }
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new Error('Authorization header is required');

    const token = authHeader.split(' ')[1];
    if (!token) throw new Error('Authorization token is required');

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        const customUser = decoded as CustomJwtPayload;
        if (customUser) {
            req.user = { id: customUser.userId, role: customUser.role };
        }
        next();
    });
};

export default authMiddleware;
