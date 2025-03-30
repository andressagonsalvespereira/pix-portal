// AdminGlobalConfig.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { getGlobalConfig, updateGlobalConfig } from '@/services/config/globalConfigService';

export default function AdminGlobalConfig() {
  const [usarAsaas, setUsarAsaas] = useState(false);
  const [asaasToken, setAsaasToken] = useState('');
  const [asaasSandbox, setAsaasSandbox] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      const config = await getGlobalConfig();
      if (config) {
        setUsarAsaas(config.usar_pix_assas || false);
        setAsaasToken(config.asaas_token || '');
        setAsaasSandbox(config.asaas_sandbox || false);
      }
      setLoading(false);
    };

    loadConfig();
  }, []);

  const handleSave = async () => {
    try {
      await updateGlobalConfig({
        usar_pix_assas: usarAsaas,
        asaas_token: asaasToken,
        asaas_sandbox: asaasSandbox,
      });

      toast({
        title: 'Configuração salva com sucesso!',
        description: 'A chave da API do Asaas foi atualizada.',
      });
    } catch (error) {
      console.error('Erro ao salvar configuração global:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Verifique o console para mais detalhes.',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-2">Configurações Globais</h1>
      <p className="text-muted-foreground mb-6">Controle global de funcionalidades da plataforma</p>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="usar_pix_assas">Usar API do Asaas para pagamentos PIX</Label>
            <Switch
              id="usar_pix_assas"
              checked={usarAsaas}
              onCheckedChange={setUsarAsaas}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asaas_token">Token da API do Asaas</Label>
            <Input
              id="asaas_token"
              value={asaasToken}
              onChange={(e) => setAsaasToken(e.target.value)}
              placeholder="sk_production_xxx ou sk_sandbox_xxx"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="asaas_sandbox">Usar ambiente Sandbox?</Label>
            <Switch
              id="asaas_sandbox"
              checked={asaasSandbox}
              onCheckedChange={setAsaasSandbox}
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSave} className="bg-primary text-white">
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}