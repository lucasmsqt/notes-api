import { Request, Response } from 'express';
import pool from '../config/db';

export async function criarEmprestimo(req: Request, res: Response): Promise<void> {
    const { nome, valor, parcelas, status, usuario_id, valor_pago } = req.body;

    const valorPago = valor_pago || 0;

    if (!nome || !valor || !parcelas || !status || !usuario_id) {
        res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        return;
    }

    try {
        const result = await pool.query(
            `INSERT INTO financeiro.emprestimos (nome, valor, parcelas, status, usuario_id, valor_pago)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nome, valor, parcelas, status, usuario_id, valorPago]
        );
        res.status(201).json({ message: 'Empréstimo criado com sucesso', emprestimo: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar o empréstimo' });
    }
}


export async function listarEmprestimos(req: Request, res: Response): Promise<void> {
    const usuario_id = req.body.usuario_id;

    if (!usuario_id) {
        res.status(400).json({ message: 'Usuário não autenticado' });
        return;
    }

    try {
        const result = await pool.query(
            `SELECT id, nome, valor, parcelas, valor_pago, 
                    (valor - valor_pago) AS valor_restante,
                    status, created_at 
             FROM financeiro.emprestimos 
             WHERE usuario_id = $1
             ORDER BY created_at DESC`,
            [usuario_id]
        );

        console.log('Dados retornados do banco:', result.rows);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao listar empréstimos:', error);
        res.status(500).json({ message: 'Erro ao listar empréstimos' });
    }
}

export async function registrarPagamento(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { valor_pago, status } = req.body;

    if (!valor_pago || valor_pago <= 0) {
        res.status(400).json({ message: 'O valor pago deve ser maior que zero' });
        return;
    }

    try {
        const result = await pool.query(
            `UPDATE financeiro.emprestimos 
             SET valor_pago = $1, status = $2, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $3 
             RETURNING *, (valor - $1) AS valor_restante`,
            [valor_pago, status, id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Empréstimo não encontrado' });
            return;
        }

        res.status(200).json({
            message: 'Pagamento registrado com sucesso',
            emprestimo: result.rows[0],
        });
    } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        res.status(500).json({ message: 'Erro ao registrar pagamento' });
    }
}

export async function deletarEmprestimo(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM financeiro.emprestimos 
             WHERE id = $1 
             RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Empréstimo não encontrado' });
        } else {
            res.status(200).json({ message: 'Empréstimo deletado com sucesso' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar o empréstimo' });
    }
}
