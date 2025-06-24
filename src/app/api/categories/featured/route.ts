import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Category } from '@/types/category';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('API Route: Handling GET request for featured categories (Supabase)');
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('featured', true);
    if (error) throw error;
    const categoriesList = (data || []).map((cat: any) => ({
      id: cat.id,
      ...cat
    }));
    return NextResponse.json(categoriesList);
  } catch (error) {
    console.error('Error fetching featured categories from Supabase:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch featured categories', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
