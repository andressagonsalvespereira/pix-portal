import { Router } from 'express';
import { gerarCobrancaPix } from '../controllers/asaasController';

const router = Router();

// rota para gerar cobrança PIX via Asaas
router.post('/pix', gerarCobrancaPix);

export default router;
