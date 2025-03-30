import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProdutoBasicInfoForm from "./form/ProdutoBasicInfoForm";
import ProdutoPricingForm from "./form/ProdutoPricingForm";
import ProdutoInventoryForm from "./form/ProdutoInventoryForm";
import ProdutoSlugForm from "./form/ProdutoSlugForm";
import ProdutoFormActions from "./form/ProdutoFormActions";

interface ProdutoFormData {
  nome: string;
  descricao: string;
  preco: string;
  parcelas: string;
  imagem_url: string;
  estoque: string;
  slug: string;
  ativo: boolean;
}

interface ProdutoFormProps {
  initialData: ProdutoFormData;
  isLoading: boolean;
  onSubmit: (formData: {
    nome: string;
    descricao: string;
    preco: number;
    parcelas: number;
    imagem_url: string;
    estoque: number;
    slug: string;
    ativo: boolean;
  }) => void;
  onCancel: () => void;
  generateSlug: () => void;
  onChange: (formData: ProdutoFormData) => void;
}

export default function ProdutoForm({ 
  initialData, 
  isLoading, 
  onSubmit, 
  onCancel,
  generateSlug,
  onChange
}: ProdutoFormProps) {
  const [form, setForm] = useState<ProdutoFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    onChange(updatedForm);
  };

  const handleSwitchChange = (checked: boolean) => {
    const updatedForm = { ...form, ativo: checked };
    setForm(updatedForm);
    onChange(updatedForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedForm = {
      ...form,
      preco: parseFloat(form.preco),
      parcelas: parseInt(form.parcelas, 10),
      estoque: parseInt(form.estoque, 10),
    };

    console.log('Form submitted with data:', formattedForm);
    onSubmit(formattedForm);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="produto-form" onSubmit={handleSubmit} className="space-y-4">
          <ProdutoBasicInfoForm
            nome={form.nome}
            descricao={form.descricao}
            imagem_url={form.imagem_url}
            onInputChange={handleChange}
          />
          
          <ProdutoPricingForm
            preco={form.preco}
            parcelas={form.parcelas}
            onInputChange={handleChange}
          />

          <ProdutoInventoryForm
            estoque={form.estoque}
            ativo={form.ativo}
            onInputChange={handleChange}
            onSwitchChange={handleSwitchChange}
          />
          
          <ProdutoSlugForm
            slug={form.slug}
            onInputChange={handleChange}
            onGenerateSlug={generateSlug}
          />
        </form>
      </CardContent>
      <CardFooter>
        <ProdutoFormActions
          isLoading={isLoading}
          onCancel={onCancel}
        />
      </CardFooter>
    </Card>
  );
}
