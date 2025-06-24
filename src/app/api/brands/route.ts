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

export async function POST(request: Request) {
  // TODO: Replace with real admin authentication check
  // if (!isAdmin(request)) {
  //   return NextResponse.json({ type: 'auth', message: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const body = await request.json();
    const { name, slug, logo, featured = false, description = '' } = body;

    // Basic validation
    if (!name || !slug || !logo) {
      return NextResponse.json({ type: 'validation', message: 'Missing required fields: name, slug, logo' }, { status: 400 });
    }

    // Uniqueness check for slug
    const { data: existing, error: findError } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', slug)
      .single();
    if (existing) {
      return NextResponse.json({ type: 'uniqueness', message: 'Brand with this slug already exists' }, { status: 409 });
    }
    if (findError && findError.code !== 'PGRST116') { // Not found is OK
      return NextResponse.json({ type: 'db', message: 'Database error during uniqueness check', details: findError.message }, { status: 500 });
    }

    // Insert new brand
    const { data, error } = await supabase
      .from('brands')
      .insert([{ name, slug, logo, featured, description }])
      .select()
      .single();
    if (error) {
      return NextResponse.json({ type: 'db', message: 'Failed to create brand', details: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ type: 'server', message: 'Unexpected server error', details: String(error) }, { status: 500 });
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
