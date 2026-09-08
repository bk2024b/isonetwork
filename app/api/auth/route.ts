import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD || 'isonetwork2024';

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('iso_admin_auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('iso_admin_auth');
  return response;
}
