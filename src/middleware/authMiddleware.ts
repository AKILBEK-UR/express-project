import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
    userId: string; // Change this to userId
}

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
            };
        }
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Authorization token is required' });
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        const customUser = decoded as CustomJwtPayload;
        if (customUser) {
            req.user = { id: customUser.userId }; // Change to userId
        }
        next();
    });
};

export default authMiddleware;

