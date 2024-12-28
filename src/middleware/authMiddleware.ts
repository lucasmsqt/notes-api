import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwtUtils'

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        res.status(401).json({ message: 'Token não fornecido'});
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.body.usuario_id = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token inválido'});
    }
} 