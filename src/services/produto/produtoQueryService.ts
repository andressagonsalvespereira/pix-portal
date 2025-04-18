
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets all available products
 */
export async function getProdutos() {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('criado_em', { ascending: false });
      
    if (error) {
      console.error("Error fetching produtos:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getProdutos:", error);
    return [];
  }
}

/**
 * Gets a specific product by its slug
 */
export async function getProdutoBySlug(slug: string) {
  if (!slug) {
    console.error("Cannot fetch produto: No slug provided");
    return null;
  }
  
  console.log("Attempting to fetch product with slug:", slug);
  
  try {
    // First try exact match
    let { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching produto with slug:", error);
      return null;
    }
    
    // If no results, try case-insensitive match
    if (!data) {
      console.log("Product not found by exact slug match, trying case-insensitive:", slug);
      
      const { data: caseInsensitiveData, error: caseInsensitiveError } = await supabase
        .from('produtos')
        .select('*')
        .ilike('slug', slug)
        .maybeSingle();
        
      if (caseInsensitiveError) {
        console.error("Error fetching produto with case-insensitive slug:", caseInsensitiveError);
        return null;
      }
      
      data = caseInsensitiveData;
    }
    
    // If still no results and it looks like a UUID, try as ID
    if (!data && slug.length > 30 && slug.includes('-')) {
      console.log("Product not found by slug, trying as ID:", slug);
      
      try {
        const { data: idData, error: idError } = await supabase
          .from('produtos')
          .select('*')
          .eq('id', slug)
          .maybeSingle();
          
        if (idError) {
          console.error("Error fetching produto with ID", slug, ":", idError);
          return null;
        }
        
        data = idData;
      } catch (idError) {
        console.error("Exception fetching produto with ID:", idError);
      }
    }
    
    if (!data) {
      console.log("No product found for slug/id:", slug);
    }
    
    return data;
  } catch (error) {
    console.error("Error in getProdutoBySlug:", error);
    return null;
  }
}

export async function getProdutoById(id: string) {
  try {
    if (!id) {
      console.error('Invalid ID parameter: ID is undefined or empty');
      throw new Error('Invalid ID parameter: ID is undefined or empty');
    }
    
    // Check if ID is a numeric string like "1" (invalid UUID)
    if (/^\d+$/.test(id)) {
      console.error(`ID "${id}" appears to be a numeric ID, not a UUID`);
      return null;
    }
    
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      if (error.code === '22P02') { // Invalid UUID syntax error
        console.error(`Error: "${id}" is not a valid UUID`);
        return null;
      }
      console.error(`Error fetching produto with ID ${id}:`, error);
      return null;
    }
    
    if (!data) {
      console.log(`No product found with ID: ${id}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Exception in getProdutoById for ID ${id}:`, error);
    return null;
  }
}
