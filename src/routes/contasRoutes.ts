import { Router } from 'express';
import { criarConta, editarConta, deletarConta, listarContas } from '../controllers/contasController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/criar', authenticate, criarConta);
router.put('/editar/:id', authenticate, editarConta);
router.delete('/deletar/:id', authenticate, deletarConta);

router.post('/listar', authenticate, listarContas)

export default router;
