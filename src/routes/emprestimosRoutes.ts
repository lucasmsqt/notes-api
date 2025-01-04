import { Router } from 'express';
import {
    criarEmprestimo,
    listarEmprestimos,
    registrarPagamento,
    deletarEmprestimo,
} from '../controllers/emprestimosController';

const router = Router();

router.post('/criar', criarEmprestimo);
router.post('/listar', listarEmprestimos);
router.put('/:id/pagamento', registrarPagamento);
router.delete('/:id', deletarEmprestimo);

export default router;
