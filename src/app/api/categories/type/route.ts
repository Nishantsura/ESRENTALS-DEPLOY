import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Non-dynamic route handler to avoid Next.js 15.1.0 typing issues
export async function GET(request: Request) {
  try {
    // Get the type parameter from the query string instead of route param
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // Validate type parameter
    if (!type) {
      return NextResponse.json(
        { message: 'Missing required query parameter: type' },
        { status: 400 }
      );
    }
    
    const validTypes = ['carType', 'fuelType', 'tag'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { message: `Invalid category type: ${type}. Valid types are: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', type);
    if (error) throw error;
    const categoriesList = (data || []).map((cat: any) => ({
      id: cat.id,
      ...cat
    }));
    
    return NextResponse.json(categoriesList);
  } catch (error) {
    console.error('Error fetching categories from Supabase:', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
