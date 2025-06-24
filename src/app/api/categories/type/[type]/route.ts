import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  const validTypes = ['carType', 'fuelType', 'tag'];
  if (!type || !validTypes.includes(type)) {
    return NextResponse.json(
      { message: `Invalid or missing category type. Valid types are: ${validTypes.join(', ')}` },
      { status: 400 }
    );
  }
  try {
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

export const revalidate = 0; 