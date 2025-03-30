// src/services/config/globalConfigService.ts
import { supabase } from '@/integrations/supabase/client';

type GlobalConfig = {
  usar_pix_assas?: boolean;
  asaas_token?: string;
  asaas_sandbox?: boolean;
};

export const getGlobalConfig = async (): Promise<GlobalConfig> => {
  try {
    const { data, error } = await supabase
      .from('configurations')
      .select('*')
      .single();

    if (error) throw new Error(error.message || 'Erro ao buscar configurações');
    if (!data) throw new Error('Nenhuma configuração encontrada');

    return data as GlobalConfig;
  } catch (error: any) {
    throw new Error('Erro ao buscar configurações globais: ' + error.message);
  }
};

export const updateGlobalConfig = async (
  config: Partial<GlobalConfig>
): Promise<GlobalConfig> => {
  try {
    const { data, error } = await supabase
      .from('configurations')
      .update(config)
      .eq('id', 1)
      .single();

    if (error) throw new Error(error.message || 'Erro ao atualizar configurações');
    if (!data) throw new Error('Configuração não encontrada para atualização');

    return data as GlobalConfig;
  } catch (error: any) {
    throw new Error('Erro ao atualizar configurações globais: ' + error.message);
  }
};
