import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// For now, allow all (match other admin endpoints)
async function isAdmin(request: Request) {
  return true;
}

export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const [cars, brands, categories, featuredCars, featuredBrands, featuredCategories] = await Promise.all([
    supabase.from('cars').select('*', { count: 'exact', head: true }),
    supabase.from('brands').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('cars').select('*', { count: 'exact', head: true }).eq('featured', true),
    supabase.from('brands').select('*', { count: 'exact', head: true }).eq('featured', true),
    supabase.from('categories').select('*', { count: 'exact', head: true }).eq('featured', true),
  ]);
  return NextResponse.json({
    totalCars: cars.count || 0,
    totalBrands: brands.count || 0,
    totalCategories: categories.count || 0,
    featuredCars: featuredCars.count || 0,
    featuredBrands: featuredBrands.count || 0,
    featuredCategories: featuredCategories.count || 0,
  });
} 