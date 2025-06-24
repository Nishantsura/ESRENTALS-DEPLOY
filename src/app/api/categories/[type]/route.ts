import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Next.js 15 route handler
export async function GET(
  request: Request,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  
  try {
    // Validate type parameter
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
    console.error(`Error fetching categories of type ${type}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch categories', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<{ type: string }> }) {
  const { type } = await context.params;
  const body = await request.json();
  const { id, ...updateData } = body;
  if (!id) {
    return NextResponse.json({ message: 'Missing category id' }, { status: 400 });
  }
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ message: 'Failed to update category', error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update category', error: String(error) }, { status: 500 });
  }
}

export const revalidate = 0;