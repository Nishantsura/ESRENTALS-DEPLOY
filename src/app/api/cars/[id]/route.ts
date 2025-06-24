import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log(`API Route: Fetching car details for ID: ${id} (Supabase)`);

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('Results contain 0 rows')) {
        // Not found
        return NextResponse.json(
          { message: 'Car not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { message: 'Car not found' },
        { status: 404 }
      );
    }

    const carData = {
      id: data.id,
      ...data
    };

    return NextResponse.json(carData);
  } catch (error) {
    console.error(`Error fetching car:`, error);
    const errorObject = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({
      message: 'Failed to fetch car details',
      error: errorObject.message,
      code: (error as { code?: string }).code || 'unknown_error'
    }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    // Only allow updating fields that exist in the schema, including brand_id
    const updateData = { ...body };
    if ('brand' in updateData) {
      delete updateData.brand;
    }
    console.log(`API Route: Updating car with ID: ${id} (Supabase)`);

    const { data, error } = await supabase
      .from('cars')
      .update(updateData)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ message: 'Failed to update car', error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error updating car:`, error);
    const errorObject = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({
      message: 'Failed to update car',
      error: errorObject.message,
      code: (error as { code?: string }).code || 'unknown_error'
    }, { status: 500 });
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
