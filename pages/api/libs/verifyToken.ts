import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

export function verifyToken(req: NextApiRequest) {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer Token
        if (!token || !process.env.JWT_SECRET) {
            return null;
        }
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}