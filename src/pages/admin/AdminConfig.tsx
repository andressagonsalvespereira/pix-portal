import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getGlobalConfig, updateGlobalConfig } from '@/services/config/globalConfigService';
import { toast } from 'sonner';

export default function AdminConfig() {
  const { id } = useParams();
  const [usarPixAsaas, setUsarPixAsaas] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const data = await getGlobalConfig();
      if (data) {
        setUsarPixAsaas(data.usar_pix_assas);
      }
      setLoading(false);
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    try {
      const { error } = await updateGlobalConfig({ usar_pix_assas: usarPixAsaas });
      if (error) throw error;
      toast.success('Configuração salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configuração');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurações Globais</h1>
        <p className="text-gray-500">Controle global de funcionalidades da plataforma</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="usar_pix_assas">Usar API do Asaas para pagamentos PIX</Label>
            <Switch
              id="usar_pix_assas"
              checked={usarPixAsaas}
              onCheckedChange={setUsarPixAsaas}
              disabled={loading}
            />
          </div>

          <Button onClick={handleSave} disabled={loading}>
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
