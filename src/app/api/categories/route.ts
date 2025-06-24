import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Category } from '@/types/category';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    console.log('API Route: Handling GET request for categories (Supabase)');
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const type = searchParams.get('type');

    let query = supabase.from('categories').select('*');
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    if (type) {
      query = query.eq('type', type);
    }
    const { data, error } = await query;
    if (error) {
      throw error;
    }
    const categoriesList: Category[] = (data || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      type: cat.type,
      featured: cat.featured,
      description: cat.description,
      image: cat.image,
    }));
    return NextResponse.json(categoriesList);
  } catch (error) {
    console.error('Error fetching categories from Supabase:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch categories', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
