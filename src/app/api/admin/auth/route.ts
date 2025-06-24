import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin authentication API endpoint
 * Placeholder for Supabase Auth admin verification
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Admin authentication via Supabase Auth not implemented yet.' },
    { status: 501 }
  );
}
