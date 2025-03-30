import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';
import { getGlobalConfig } from '@/services/config/globalConfigService';
import CheckoutLoading from '@/components/checkout/CheckoutLoading';
import CheckoutError from '@/components/checkout/CheckoutError';
import ModernCheckout from '@/components/checkout/ModernCheckout';
import OneCheckout from '@/components/checkout/OneCheckout';

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  console.log("CheckoutPage: Rendering with slug:", slug);

  const handlePixPayment = async () => {
    try {
      const globalConfig = await getGlobalConfig();

      if (globalConfig?.usar_pix_assas && globalConfig.asaas_token) {
        navigate('/pix-asaas');
      } else {
        navigate(`/checkout/${slug}/pix`);
      }
    } catch (error) {
      console.error('Erro ao buscar configuração global:', error);
      navigate(`/checkout/${slug}/pix`);
    }
  };

  const { data: producto, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['produto', slug],
    queryFn: () => getProdutoBySlug(slug || ''),
    enabled: !!slug,
  });

  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['checkout-config', producto?.id],
    queryFn: () => getConfig(producto?.id || ''),
    enabled: !!producto?.id,
  });

  const isLoading = productLoading || configLoading;

  if (isLoading) return <CheckoutLoading />;

  if (productError || !producto) {
    console.error("CheckoutPage: Error or no product found:", productError);
    return (
      <CheckoutError
        title="Produto não encontrado"
        message="O produto que você está procurando não existe ou não está disponível."
      />
    );
  }

  const paymentMethods = config?.payment_methods || ['pix', 'cartao'];
  const bgColor = config?.cor_fundo || '#f5f5f7';
  const isOneCheckout = Boolean(config?.one_checkout_enabled);

  const configWithDefaults = {
    ...config,
    payment_methods: paymentMethods,
    one_checkout_enabled: isOneCheckout,
    handlePixPayment, // << Adiciona para repassar ao OneCheckout
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {isOneCheckout ? (
        <OneCheckout producto={producto} config={configWithDefaults} />
      ) : (
        <ModernCheckout producto={producto} config={configWithDefaults} />
      )}
    </div>
  );
}
