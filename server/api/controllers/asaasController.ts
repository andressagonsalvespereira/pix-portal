import { Request, Response } from 'express';
import { criarCobrancaPix } from '../services/asaas';

export const gerarCobrancaPix = async (req: Request, res: Response) => {
  try {
    const { customer, value, description } = req.body;

    if (!customer || !value) {
      return res.status(400).json({ error: 'Parâmetros insuficientes.' });
    }

    const resultado = await criarCobrancaPix({ customer, value, description });

    return res.status(201).json(resultado);
  } catch (error: any) {
    console.error('Erro na cobrança PIX:', error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
};
