
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  criarProduto, 
  atualizarProduto, 
  deletarProduto 
} from '@/services/produtoService';
import { toast } from '@/hooks/use-toast';

export const useFormSubmit = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (formData: {
    nome: string;
    descricao: string;
    preco: number;
    parcelas: number;
    imagem_url: string;
    estoque: number;
    slug: string;
    ativo: boolean;
  }) => {
    setLoading(true);
    try {
      // Adapt to the service's expected structure
      const produtoData = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: formData.preco,
        parcelas: formData.parcelas, // ✅ ESSENCIAL
        estoque: formData.estoque,
        ativo: formData.ativo,
        categoria_id: '', // Pode deixar null ou opcional se quiser
        imagens: formData.imagem_url ? [formData.imagem_url] : [],
        slug: formData.slug,
      };
      
      const result = await criarProduto(produtoData);
      
      if (result) {
        toast({
          title: "Produto criado com sucesso!",
          description: `O produto "${formData.nome}" foi criado.`,
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/admin/produtos');
        }
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro ao criar produto",
        description: "Ocorreu um erro ao criar o produto. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, formData: {
    nome: string;
    descricao: string;
    preco: number;
    parcelas: number;
    imagem_url: string;
    estoque: number;
    slug: string;
    ativo: boolean;
  }) => {
    setLoading(true);
    try {
      // Adapt to the service's expected structure
      const updates = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: formData.preco,
        parcelas: formData.parcelas,
        estoque: formData.estoque,
        ativo: formData.ativo,
        slug: formData.slug,
        imagens: formData.imagem_url ? [formData.imagem_url] : undefined,
      };
      
      
      const result = await atualizarProduto(id, updates);
      
      if (result) {
        toast({
          title: "Produto atualizado com sucesso!",
          description: `O produto "${formData.nome}" foi atualizado.`,
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/admin/produtos');
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro ao atualizar produto",
        description: "Ocorreu um erro ao atualizar o produto. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    setLoading(true);
    try {
      const success = await deletarProduto(id);
      
      if (success) {
        toast({
          title: "Produto excluído com sucesso!",
          description: `O produto "${nome}" foi excluído.`,
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/admin/produtos');
        }
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro ao excluir produto",
        description: "Ocorreu um erro ao excluir o produto. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
