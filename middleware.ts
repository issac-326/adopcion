import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server';

import { updateSession } from '@/utils/supabase/middelware'

export async function middleware(request: NextRequest) {
  const token = localStorage.getItem('token'); // Esto NO funcionará en el middleware del lado del servidor

  // Redirigir a login si el token no existe y el usuario intenta acceder a una página protegida
  if (!token && request.nextUrl.pathname.startsWith('/menu')) {
      return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
