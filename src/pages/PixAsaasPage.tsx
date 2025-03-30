// src/pages/PixAsaasPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PixAsaasPage = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [codigoCopiaCola, setCodigoCopiaCola] = useState('');
  const [invoiceLink, setInvoiceLink] = useState('');
  const [status, setStatus] = useState<'gerando...' | 'aguardando' | 'erro'>('gerando...');
  const navigate = useNavigate();

  useEffect(() => {
    const gerarPagamento = async () => {
      try {
        const res = await fetch('/api/asaas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: 'Cliente Teste',
            cpf: '12345678900',
            valor: 49.9,
            pedidoId: 'abc123',
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.qrCodeUrl) {
          throw new Error(data.error || 'Erro ao gerar cobrança');
        }

        setQrCodeUrl(data.qrCodeUrl);
        setCodigoCopiaCola(data.codigoCopiaCola);
        setInvoiceLink(data.invoiceUrl || data.qrCodeUrl);
        setStatus('aguardando');
      } catch (error) {
        console.error('Erro ao gerar cobrança:', error);
        toast.error('Erro ao gerar cobrança PIX via Asaas');
        setStatus('erro');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    gerarPagamento();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Pagamento via PIX (Asaas)</h1>
      {status === 'gerando...' && <p className="text-gray-500">Gerando cobrança...</p>}
      {status === 'aguardando' && (
        <>
          {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 border mb-4" />}
          {codigoCopiaCola && (
            <div className="bg-gray-100 p-3 rounded text-sm text-gray-800 mb-4">{codigoCopiaCola}</div>
          )}
          <a href={invoiceLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Pagar pelo link
          </a>
        </>
      )}
      {status === 'erro' && <p className="text-red-500">Erro ao gerar cobrança. Redirecionando...</p>}
    </div>
  );
};

export default PixAsaasPage;
