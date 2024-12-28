import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '../models/userModel';
import { generateToken } from '../utils/jwtUtils';

export async function login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400).json({ message: 'Email e senha são obrigatórios'});
        return;
    }

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            res.status(404).json({ message: 'Email não encontrado'})
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Senha inválida' })
            return;
        }

        const token = generateToken({ id: user.id, email: user.email });

        res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            userId: user.id
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({message: 'Erro interno no servidor'});
    }
}