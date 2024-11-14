import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Obtén el token desde la cookie 'authToken'
  const token = request.cookies.get('authToken')?.value;

  // Si no hay token, redirige al login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verifica el token JWT usando la clave secreta del entorno
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next(); // Deja que la solicitud continúe si el token es válido
  } catch (error) {
    // Si el token es inválido o ha expirado, redirige al login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/menu/:path*'], // Define las rutas que deseas proteger
};

