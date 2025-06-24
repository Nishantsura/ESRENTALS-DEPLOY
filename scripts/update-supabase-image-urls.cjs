require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLIC_URL_PREFIX = `${PROJECT_URL}/storage/v1/object/public`;

function getSupabaseUrl(bucket, path) {
  return `${PUBLIC_URL_PREFIX}/${bucket}/${path}`;
}

async function updateBrands() {
  console.log('🔄 Updating brand logos...');
  const { data: brands, error } = await supabase.from('brands').select('*');
  if (error) throw error;
  for (const brand of brands) {
    if (brand.logo && !brand.logo.startsWith('http')) {
      const newUrl = getSupabaseUrl('brands', `${brand.id}/logo`);
      const { error: updateError } = await supabase
        .from('brands')
        .update({ logo: newUrl })
        .eq('id', brand.id);
      if (updateError) {
        console.error(`❌ Failed to update logo for brand ${brand.name}:`, updateError.message);
      } else {
        console.log(`✅ Updated logo for brand ${brand.name}`);
      }
    }
  }
}

async function updateCategories() {
  console.log('🔄 Updating category images...');
  const { data: categories, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  for (const cat of categories) {
    if (cat.image && !cat.image.startsWith('http')) {
      const newUrl = getSupabaseUrl('categories', `${cat.id}/image`);
      const { error: updateError } = await supabase
        .from('categories')
        .update({ image: newUrl })
        .eq('id', cat.id);
      if (updateError) {
        console.error(`❌ Failed to update image for category ${cat.name}:`, updateError.message);
      } else {
        console.log(`✅ Updated image for category ${cat.name}`);
      }
    }
  }
}

async function updateCars() {
  console.log('🔄 Updating car images...');
  const { data: cars, error } = await supabase.from('cars').select('*');
  if (error) throw error;
  for (const car of cars) {
    let updated = false;
    let newImages = [];
    if (Array.isArray(car.images) && car.images.length > 0) {
      newImages = car.images.map((img, idx) => {
        if (img && !img.startsWith('http')) {
          // Try to infer the extension from the original filename if possible
          const ext = img.split('.').pop() || 'jpg';
          return getSupabaseUrl('cars', `${car.id}/images/${img}`);
        }
        return img;
      });
      updated = true;
    }
    if (updated) {
      const { error: updateError } = await supabase
        .from('cars')
        .update({ images: newImages })
        .eq('id', car.id);
      if (updateError) {
        console.error(`❌ Failed to update images for car ${car.name}:`, updateError.message);
      } else {
        console.log(`✅ Updated images for car ${car.name}`);
      }
    }
  }
}

async function main() {
  try {
    await updateBrands();
    await updateCategories();
    await updateCars();
    console.log('🎉 All image URLs updated in Supabase!');
  } catch (err) {
    console.error('💥 Error updating image URLs:', err);
    process.exit(1);
  }
  process.exit(0);
}

main(); 