import { Request, Response } from 'express';
import pool from '../config/db';

export async function criarConta(req: Request, res: Response): Promise<void> {
    const { nome, valor, status, referencia } = req.body;
    const usuario_id = req.body.usuario_id;
    const referenciaCompleta = `${referencia}-01`;

    if (!nome || !valor || !status || !referencia) {
        res.status(400).json({ message: 'Nome, valor, status e referência são obrigatórios' });
        return;
    }

    try {
        const result = await pool.query(
            'INSERT INTO financeiro.contas (nome, valor, status, referencia, usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, valor, status, referenciaCompleta, usuario_id]
        );
        res.status(201).json({ message: 'Conta criada com sucesso', conta: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar a conta' });
    }
}

export async function editarConta(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { nome, valor, status, referencia } = req.body;
    const usuario_id = req.body.usuario_id;
    const referenciaCompleta = `${referencia}-01`;

    if (!nome || !valor || !status || !referencia) {
        res.status(400).json({ message: 'Nome, valor, status e referência são obrigatórios' });
        return;
    }

    try {
        const result = await pool.query(
            'UPDATE financeiro.contas SET nome = $1, valor = $2, status = $3, referencia = $4 WHERE id = $5 AND usuario_id = $6 RETURNING *',
            [nome, valor, status, referenciaCompleta, id, usuario_id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Conta não encontrada ou acesso negado' });
        } else {
            res.status(200).json({ message: 'Conta atualizada com sucesso', conta: result.rows[0] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar a conta' });
    }
}

export async function deletarConta(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const usuario_id = req.body.usuario_id;

    try {
        const result = await pool.query(
            'DELETE FROM financeiro.contas WHERE id = $1 AND usuario_id = $2 RETURNING *',
            [id, usuario_id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Conta não encontrada ou acesso negado' });
        } else {
            res.status(200).json({ message: 'Conta deletada com sucesso' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar a conta' });
    }
}

export async function listarContas(req: Request, res: Response): Promise<void> {
    const usuario_id = req.body.usuario_id;

    try {
        const result = await pool.query(
            `SELECT id, nome, valor, status, TO_CHAR(referencia::date, 'YYYY-MM') AS referencia, usuario_id, created_at FROM financeiro.contas WHERE usuario_id = $1 ORDER BY referencia DESC, created_at DESC`,
            [usuario_id]
        );
        console.log(result)
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar contas' });
    }
}
