// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // Establece la cookie con max-age 0 para eliminarla
  response.cookies.set('authToken', '', { path: '/', maxAge: 0, httpOnly: true, secure: true });

  return response;
}
