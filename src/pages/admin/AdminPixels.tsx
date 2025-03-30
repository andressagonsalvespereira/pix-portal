import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getPixel, criarOuAtualizarPixel } from '@/services/pixelService';
import { getProdutoById } from '@/services/produtoService';

const formSchema = z.object({
  facebook_pixel_id: z.string().optional(),
  gtm_id: z.string().optional(),
  custom_script: z.string().optional()
});

export default function AdminPixels() {
  const { id: productId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pixelData, setPixelData] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(productId);
  const [productName, setProductName] = useState<string | undefined>('');
  const [error, setError] = useState<string | null>(null); // Novo estado para erros
  const { toast } = useToast();

  console.log("productId:", productId); // Depuração
  console.log("selectedProduct:", selectedProduct); // Depuração

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facebook_pixel_id: '',
      gtm_id: '',
      custom_script: ''
    }
  });

  useEffect(() => {
    if (selectedProduct) {
      console.log("Buscando pixel para produto:", selectedProduct); // Depuração
      getPixel(selectedProduct)
        .then(data => {
          console.log("Pixel data:", data); // Depuração
          setPixelData(data);
        })
        .catch(error => {
          console.error("Erro ao buscar pixels:", error);
          setError("Erro ao carregar os pixels. Verifique o console para mais detalhes."); // Exibir erro na tela
        });

      console.log("Buscando produto:", selectedProduct); // Depuração
      getProdutoById(selectedProduct)
        .then(product => {
          console.log("Produto:", product); // Depuração
          setProductName(product?.nome);
        })
        .catch(error => {
          console.error("Erro ao buscar produto:", error);
          setError("Erro ao carregar o produto. Verifique o console para mais detalhes."); // Exibir erro na tela
        });
    } else {
      setError("Nenhum produto selecionado. Por favor, acesse a página com um ID de produto válido.");
    }
  }, [selectedProduct]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const pixelData = {
        produto_id: selectedProduct,
        facebook_pixel_id: data.facebook_pixel_id || undefined,
        gtm_id: data.gtm_id || undefined,
        custom_script: data.custom_script || undefined
      };

      await criarOuAtualizarPixel(pixelData);

      toast({
        title: "Sucesso",
        description: "Pixels atualizados com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar pixels:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar pixels. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (pixelData) {
      form.reset({
        facebook_pixel_id: pixelData.facebook_pixel_id || '',
        gtm_id: pixelData.gtm_id || '',
        custom_script: pixelData.custom_script || ''
      });
    } else {
      form.reset({
        facebook_pixel_id: '',
        gtm_id: '',
        custom_script: ''
      });
    }
  }, [pixelData, form]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>; // Exibir erro na tela
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link to="/admin/produtos" className="text-blue-500 hover:underline flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
          <h1 className="text-2xl font-bold">Editar Pixels</h1>
          {productName && <p className="text-gray-500">Editando pixels do produto: {productName}</p>}
        </div>
      </div>
      <Separator className="mb-4" />

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Configuração de Pixels</h2>
          <p className="text-sm text-gray-500">Configure os pixels de rastreamento para este produto.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="facebook_pixel_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Pixel ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Facebook Pixel ID (ex: 1234567890)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gtm_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Tag Manager ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Google Tag Manager ID (ex: GTM-XXXXXX)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="custom_script"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Script Personalizado</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Scripts personalizados (ex: Hotjar, TikTok, etc)"
                        className="font-mono h-40"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}