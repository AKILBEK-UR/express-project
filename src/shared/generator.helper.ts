import jwt from 'jsonwebtoken';

export function generateToken(userId: string, role:'admin' | 'user') {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret is not defined.");
    }
    const payload = { userId, role };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '48h',
    });
}