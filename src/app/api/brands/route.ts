import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Brand } from '@/types/brand';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    console.log('API Route: Handling GET request for brands (Supabase)');
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    let query = supabase.from('brands').select('*');
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    const { data, error } = await query;
    if (error) {
      throw error;
    }
    const brandsList = (data || []).map((brand: any) => ({
      id: brand.id,
      name: brand.name,
      logo: brand.logo,
      slug: brand.slug,
      featured: brand.featured,
      description: brand.description,
    }));
    return NextResponse.json(brandsList);
  } catch (error) {
    console.error('Error fetching brands from Supabase:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch brands', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
