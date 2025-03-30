import { createClient } from '@supabase/supabase-js';
import { Database } from '../../src/types/database.types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey
);
