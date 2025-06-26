import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  if (!slug) {
    return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
  }
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error || !data) {
      return NextResponse.json({ message: 'Brand not found' }, { status: 404 });
    }
    return NextResponse.json({
      id: data.id,
      name: data.name,
      logo: data.logo,
      slug: data.slug,
      featured: data.featured,
      description: data.description,
      carCount: data.carCount,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch brand', error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const body = await request.json();

  // Remove id from the update payload if present
  if ('id' in body) {
    delete body.id;
  }

  try {
    const { data, error } = await supabase
      .from('brands')
      .update(body)
      .eq('slug', slug)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ message: 'Failed to update brand', error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update brand', error: String(error) }, { status: 500 });
  }
} 