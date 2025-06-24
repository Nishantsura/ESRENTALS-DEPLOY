import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLIC_URL_PREFIX = `${PROJECT_URL}/storage/v1/object/public`;

function getSupabaseUrl(bucket: string, path: string) {
  return `${PUBLIC_URL_PREFIX}/${bucket}/${path}`;
}

export const uploadImages = async (files: FileList, carId: string): Promise<string[]> => {
  const uploadPromises = Array.from(files).map(async (file) => {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
    const storagePath = `cars/${carId}/images/${filename}`;
    const { error } = await supabase.storage.from('cars').upload(storagePath, file, {
      upsert: true,
      contentType: file.type
    });
    if (error) {
      console.error('Error uploading image to Supabase:', error.message);
      throw error;
    }
    return getSupabaseUrl('cars', `${carId}/images/${filename}`);
  });
  const urls = await Promise.all(uploadPromises);
  return urls;
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
  // path example: brands/{id}/logo or categories/{id}/image
  let bucket = 'cars';
  if (path.startsWith('brands/')) bucket = 'brands';
  else if (path.startsWith('categories/')) bucket = 'categories';
  const storagePath = path.replace(`${bucket}/`, '');
  const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    upsert: true,
    contentType: file.type
  });
  if (error) {
    console.error('Error uploading image to Supabase:', error.message);
    throw error;
  }
  return getSupabaseUrl(bucket, storagePath);
};
