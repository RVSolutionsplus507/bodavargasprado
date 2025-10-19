// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadMedia(file, section) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${section}/${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `wedding-gallery/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from('media').getPublicUrl(filePath);
  
  return data.publicUrl;
}
