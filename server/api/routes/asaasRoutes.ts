import express from 'express';
import { criarCobrancaPixHandler } from '../controllers/asaasController';

const router = express.Router();

router.post('/criar-cobranca', criarCobrancaPixHandler);

export default router;
