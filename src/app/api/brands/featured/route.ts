import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Brand } from '@/types/brand';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('API Route: Handling GET request for featured brands (Supabase)');
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('featured', true);
    if (error) throw error;
    const brandsList = (data || []).map((brand: any) => ({
      id: brand.id,
      ...brand
    }));
    return NextResponse.json(brandsList);
  } catch (error) {
    console.error('Error fetching featured brands from Supabase:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch featured brands', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
