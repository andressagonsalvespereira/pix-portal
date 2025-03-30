import { Request, Response } from 'express';
import { criarCobrancaPix } from '../services/asaas';

export const criarCobrancaPixHandler = async (req: Request, res: Response) => {
  try {
    const cobranca = await criarCobrancaPix(req.body);
    res.status(200).json(cobranca);
  } catch (error) {
    console.error('Erro ao criar cobrança:', error);
    res.status(500).json({ error: 'Erro ao criar cobrança' });
  }
};
