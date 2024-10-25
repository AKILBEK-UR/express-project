import jwt from 'jsonwebtoken';

export function generateToken(id: string): string {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret is not defined.");
    }
    
    return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: '48h',
    });
}