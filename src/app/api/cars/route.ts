import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Car } from '@/types/car';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Handler for GET requests to /api/cars
 */
export async function GET(request: Request) {
  try {
    console.log('API Route: Handling GET request for cars (Supabase)');
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const brandId = searchParams.get('brand_id');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const fuelType = searchParams.get('fuelType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let query = supabase.from('cars').select('*');
    if (featured === 'true') query = query.eq('featured', true);
    if (brandId && brandId !== 'all') query = query.eq('brand_id', brandId);
    if (category && category !== 'all') query = query.contains('tags', [category]);
    if (type) query = query.eq('type', type);
    if (tag) query = query.contains('tags', [tag]);
    if (fuelType) query = query.eq('fuel_type', fuelType);
    if (minPrice) query = query.gte('daily_price', Number(minPrice));
    if (maxPrice) query = query.lte('daily_price', Number(maxPrice));

    const { data, error } = await query;
    if (error) throw error;

    const carsList: Car[] = (data || []).map((car: any) => ({
      id: car.id,
      name: car.name,
      brand_id: car.brand_id || '',
      transmission: car.transmission || 'Automatic',
      seats: car.seats || 4,
      year: car.year,
      rating: car.rating || 5,
      rareCar: car.rareCar || false,
      featured: car.featured || false,
      fuelType: car.fuel_type || car.fuelType || 'Petrol',
      engineCapacity: car.engineCapacity || '',
      power: car.power || '',
      dailyPrice: car.daily_price || 0,
      type: car.type || 'Sedan',
      tags: car.tags || [],
      description: car.description || '',
      images: car.images || [],
      available: car.available !== undefined ? car.available : true,
      location: car.location || {
        name: '',
        coordinates: { lat: 0, lng: 0 }
      },
      mileage: car.mileage || 0,
      category: car.category || '',
      specs: car.specs || {},
    }));

    return NextResponse.json(carsList);
  } catch (error) {
    console.error('Error fetching cars from Supabase:', error);
    const errorObject = error instanceof Error ? error : new Error(String(error));
    return new NextResponse(
      JSON.stringify({
        message: 'Failed to fetch cars',
        error: errorObject.message,
        timestamp: new Date().toISOString(),
        code: (error as { code?: string }).code || 'unknown_error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Handler for POST requests to /api/cars
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Map frontend fields to Supabase columns
    const newCar = {
      name: body.name,
      brand_id: body.brand_id || '',
      year: body.year,
      category: body.category || '',
      type: body.type,
      daily_price: body.dailyPrice,
      mileage: body.mileage || 0,
      fuel_type: body.fuelType || body.fuel_type,
      transmission: body.transmission,
      featured: body.featured || false,
      tags: body.tags || [],
      images: body.images || [],
      description: body.description || '',
      specs: body.specs || {},
      available: body.available !== undefined ? body.available : true,
      rareCar: body.rareCar || false,
      rating: body.rating || 0,
      engineCapacity: body.engineCapacity || '',
      power: body.power || '',
      location: body.location || null,
      seats: body.seats || 4,
    };
    const { data, error } = await supabase
      .from('cars')
      .insert([newCar])
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ message: 'Failed to create car', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
