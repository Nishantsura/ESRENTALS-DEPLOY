import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Car } from '@/types/car';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  context: { params: { type: string } }
) {
  const { type } = context.params;
  if (!type) {
    return NextResponse.json({ message: 'Missing type' }, { status: 400 });
  }
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('type', decodeURIComponent(type));
    if (error) {
      return NextResponse.json({ message: 'Failed to fetch cars', error: error.message }, { status: 500 });
    }
    const carsList: Car[] = (data || []).map((car: any) => ({
      id: car.id,
      name: car.name,
      brand_id: car.brand_id || car.brand_name || '',
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
    return NextResponse.json({ message: 'Failed to fetch cars', error: String(error) }, { status: 500 });
  }
} 