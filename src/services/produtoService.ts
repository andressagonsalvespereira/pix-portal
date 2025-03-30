import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches a product by its ID, handling both UUID and numeric IDs
 */
export async function getProdutoById(id: string) {
  if (!id) {
    console.error("Cannot fetch product: No ID provided");
    return null;
  }

  try {
    let { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error && (error.code === '22P02' || error.message?.includes('invalid input syntax for type uuid'))) {
      const { data: slugData, error: slugError } = await supabase
        .from('produtos')
        .select('*')
        .eq('slug', id)
        .maybeSingle();

      if (slugError) return null;
      data = slugData;
    } else if (error) {
      console.error("Error fetching produto with ID:", error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error in getProdutoById:', error);
    return null;
  }
}

/**
 * Fetches all available products
 */
export async function getProdutos() {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error in getProdutos:', error);
    return [];
  }
}

/**
 * Creates a new product
 */
export async function criarProduto(produto: {
  nome: string;
  descricao: string;
  preco: number;
  parcelas: number;
  estoque: number;
  ativo: boolean;
  imagem_url: string;
  categoria_id: string | null;
  imagens: string[];
  slug: string;
}) {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .insert([produto])
      .select();

    if (error) {
      console.error('Error creating produto:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in criarProduto:', error);
    return null;
  }
}

/**
 * Updates an existing product
 */
export async function atualizarProduto(id: string, updates: {
  nome?: string;
  descricao?: string;
  preco?: number;
  parcelas?: number;
  estoque?: number;
  ativo?: boolean;
  imagem_url?: string;
  categoria_id?: string | null;
  imagens?: string[];
  slug?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in atualizarProduto:', error);
    return null;
  }
}

/**
 * Deletes a product by its ID
 */
export async function deletarProduto(id: string) {
  try {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error in deletarProduto:', error);
    return false;
  }
}

/**
 * Fetches a product by its slug
 */
export async function getProdutoBySlug(slug: string) {
  if (!slug) {
    console.error("Cannot fetch produto: No slug provided");
    return null;
  }

  try {
    let { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) return null;

    if (!data) {
      const { data: ciData, error: ciError } = await supabase
        .from('produtos')
        .select('*')
        .ilike('slug', slug)
        .maybeSingle();

      if (ciError) return null;
      data = ciData;
    }

    if (!data && slug.length > 30 && slug.includes('-')) {
      const { data: idData, error: idError } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', slug)
        .maybeSingle();

      if (!idError) data = idData;
    }

    return data || null;
  } catch (error) {
    console.error("Error in getProdutoBySlug:", error);
    return null;
  }
}
