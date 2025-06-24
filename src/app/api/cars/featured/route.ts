import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Car } from '@/types/car';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('API Route: Handling GET request for featured cars (Supabase)');
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('featured', true);
    if (error) throw error;
    const carsList = (data || []).map((car: any) => ({
      id: car.id,
      ...car,
      dailyPrice: car.dailyPrice ?? car.daily_price ?? 0,
    }));
    return NextResponse.json(carsList);
  } catch (error) {
    console.error('Error fetching featured cars from Supabase:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch featured cars', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
