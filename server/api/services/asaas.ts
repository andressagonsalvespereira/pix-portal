import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use a chave com permissão de leitura
);

async function carregarConfiguracoesCheckout() {
  const { data, error } = await supabase
    .from('checkout_config')
    .select('asaas_api_key, asaas_sandbox')
    .limit(1)
    .single();

  if (error || !data) {
    throw new Error('Erro ao carregar configurações do checkout no Supabase');
  }

  const isSandbox = data.asaas_sandbox === true;

  const api = axios.create({
    baseURL: isSandbox
      ? 'https://sandbox.asaas.com/api/v3'
      : 'https://www.asaas.com/api/v3',
    headers: {
      access_token: data.asaas_api_key,
      'Content-Type': 'application/json',
    },
  });

  return api;
}

export const criarCobrancaPix = async (dados: {
  customer: string;
  value: number;
  description: string;
}) => {
  const api = await carregarConfiguracoesCheckout();

  const response = await api.post('/payments', {
    customer: dados.customer,
    billingType: 'PIX',
    value: dados.value,
    description: dados.description,
  });

  return response.data;
};
