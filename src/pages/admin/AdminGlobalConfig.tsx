import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { getGlobalConfig, updateGlobalConfig } from '@/services/config/globalConfigService';

export default function AdminGlobalConfig() {
  const [usarAsaas, setUsarAsaas] = useState(false);
  const [asaasToken, setAsaasToken] = useState('');
  const [asaasSandbox, setAsaasSandbox] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Novo estado para o botão

  useEffect(() => {
    async function loadConfig() {
      try {
        const config = await getGlobalConfig();
        if (config) {
          setUsarAsaas(config.usar_pix_assas || false);
          setAsaasToken(config.asaas_token || '');
          setAsaasSandbox(config.asaas_sandbox || false);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true); // Ativa o loading no botão
    try {
      await updateGlobalConfig({
        usar_pix_assas: usarAsaas,
        asaas_token: asaasToken,
        asaas_sandbox: asaasSandbox,
      });

      toast({
        title: 'Configuração salva com sucesso!',
        description: 'As configurações da API do Asaas foram atualizadas.',
      });
    } catch (error: any) {
      console.error('Erro ao salvar configuração global:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Verifique o console para mais detalhes.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false); // Desativa o loading
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Configurações Globais</h1>
      <p className="text-muted-foreground mb-6">
        Controle global de funcionalidades, incluindo o uso da API do Asaas para pagamentos PIX.
      </p>

      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="usar_pix_assas">Usar API do Asaas para pagamentos PIX</Label>
          <Switch id="usar_pix_assas" checked={usarAsaas} onCheckedChange={setUsarAsaas} />
        </div>

        <div>
          <Label htmlFor="asaas_token">Token da API do Asaas</Label>
          <Input
            id="asaas_token"
            value={asaasToken}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAsaasToken(e.target.value)}
            placeholder="sk_production_xxx ou sk_sandbox_xxx"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="asaas_sandbox">Usar ambiente Sandbox?</Label>
          <Switch id="asaas_sandbox" checked={asaasSandbox} onCheckedChange={setAsaasSandbox} />
        </div>

        <div className="mt-4">
          <Button
            onClick={handleSave}
            className="bg-primary text-white"
            disabled={isSaving} // Desativa o botão enquanto salva
          >
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>
    </div>
  );
}