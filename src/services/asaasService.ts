// src/services/asaasService.ts
import { getGlobalConfig } from './config/globalConfigService';

interface GerarCobrancaParams {
  nome: string;
  cpfCnpj: string;
  valor: number;
  email?: string;
  descricao?: string;
}

interface GerarCobrancaResponse {
  invoiceUrl: string;
  pixQrCode: string;
  pixQrCodeImageUrl: string;
}

export const gerarCobrancaPix = async (params: GerarCobrancaParams): Promise<GerarCobrancaResponse> => {
  const config = await getGlobalConfig();

  if (!config || !config.asaas_token) {
    throw new Error('Token do Asaas não configurado');
  }

  const baseUrl = config.asaas_sandbox
    ? 'https://sandbox.asaas.com/api/v3'
    : 'https://www.asaas.com/api/v3';

  // 1. Criar cliente
  const clienteRes = await fetch(`${baseUrl}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': config.asaas_token,
    },
    body: JSON.stringify({
      name: params.nome,
      cpfCnpj: params.cpfCnpj,
      email: params.email || 'teste@email.com'
    })
  });

  const cliente = await clienteRes.json();
  if (!cliente.id) {
    throw new Error('Erro ao criar cliente: ' + JSON.stringify(cliente));
  }

  // 2. Criar cobrança
  const cobrancaRes = await fetch(`${baseUrl}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': config.asaas_token,
    },
    body: JSON.stringify({
      customer: cliente.id,
      billingType: 'PIX',
      value: params.valor,
      description: params.descricao || 'Cobrança via PIX',
      dueDate: new Date().toISOString().split('T')[0],
    })
  });

  const cobranca = await cobrancaRes.json();
  if (!cobranca.invoiceUrl) {
    throw new Error('Erro ao criar cobrança: ' + JSON.stringify(cobranca));
  }

  return {
    invoiceUrl: cobranca.invoiceUrl,
    pixQrCode: cobranca.pixQrCode,
    pixQrCodeImageUrl: cobranca.pixQrCodeImageUrl,
  };
};