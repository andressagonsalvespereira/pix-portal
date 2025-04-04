
/**
 * Default configuration values for checkout
 */
export const DEFAULT_CONFIG = {
  cor_fundo: '#f9fafb',
  cor_botao: '#22c55e',
  texto_botao: 'Finalizar compra',
  exibir_testemunhos: true,
  numero_aleatorio_visitas: true,
  bloquear_cpfs: [],
  chave_pix: '',
  qr_code: '',
  mensagem_pix: '',
  tempo_expiracao: 15,
  nome_beneficiario: 'Nome do Beneficiário',
  tipo_chave: 'email',
  timer_enabled: false,
  timer_minutes: 15,
  timer_text: 'Oferta expira em:',
  timer_bg_color: '#ef4444',
  timer_text_color: '#ffffff',
  discount_badge_text: 'Oferta especial',
  discount_badge_enabled: false,
  discount_amount: 0,
  original_price: null,
  payment_security_text: 'Pagamento 100% seguro',
  imagem_banner: null,
  banner_bg_color: '#f3f4f6',
  payment_methods: ['pix', 'cartao'],
  show_header: true,
  header_message: 'Oferta por tempo limitado!',
  header_bg_color: '#ef4444',
  header_text_color: '#ffffff',
  show_footer: true,
  footer_text: '© 2023 Todos os direitos reservados',
  testimonials_title: 'O que nossos clientes dizem',
  one_checkout_enabled: false,
  form_header_text: 'PREENCHA SEUS DADOS ABAIXO',
  form_header_bg_color: '#dc2626',
  form_header_text_color: '#ffffff',
  company_name: 'Minha Empresa',
  company_description: 'Descrição da empresa',
  contact_email: 'contato@empresa.com',
  contact_phone: '(11) 9999-9999',
  show_terms_link: true,
  show_privacy_link: true,
  terms_url: '/termos',
  privacy_url: '/privacidade',
  mostrar_qrcode_mobile: true,
  pix_redirect_url: '',
  
  // PIX page specific properties
  pix_titulo: 'Finalize seu pagamento com PIX',
  pix_subtitulo: 'Escaneie o QR Code ou copie o código para realizar o pagamento',
  pix_timer_texto: 'Faltam {minutos}:{segundos} para o pagamento expirar',
  pix_botao_texto: 'Já fiz o pagamento',
  pix_seguranca_texto: 'Seu pagamento está 100% seguro e criptografado',
  pix_compra_titulo: 'Resumo da compra',
  pix_mostrar_produto: true,
  pix_mostrar_termos: true,
  pix_saiba_mais_texto: 'Saiba mais sobre o PIX',
  pix_texto_copiado: 'Código copiado!',
  pix_instrucoes_titulo: 'Como pagar com PIX',
  pix_instrucoes: [
    'Abra o aplicativo do seu banco',
    'Escolha a opção PIX',
    'Escaneie o QR Code ou cole o código',
    'Confirme os dados e finalize o pagamento'
  ],
  faqs: []
};
