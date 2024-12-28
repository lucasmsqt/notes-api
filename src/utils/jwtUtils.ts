import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { CustomJwtPayload } from '../interfaces';

dotenv.config();

export function generateToken(payload: object): string {
    return jwt.sign(payload, String(process.env.JWT_SECRET));
}

export function verifyToken(token: string): CustomJwtPayload {
    try {
        const decoded = jwt.verify(token, String(process.env.JWT_SECRET)) as CustomJwtPayload;
        return decoded;
    } catch (err) {
        throw new Error('Token inválido')
    }
}