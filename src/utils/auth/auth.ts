import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Obtiene el ID del usuario autenticado a partir del token JWT almacenado en cookies.
 * 
 * @returns {string | null} El ID del usuario autenticado, o `null` si el token no existe o es inválido.
 */
export const getAuthenticatedUserId = (): string | null => {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  // Retorna null si no hay token
  if (!token) return null;

  try {
    // Decodifica el token usando la clave secreta almacenada en el entorno
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Verifica que el token decodificado contenga el campo `id_usuario`
    if (typeof decoded === 'object' && 'id_usuario' in decoded) {
      return decoded.id_usuario as string;
    } else {
      console.error('El token JWT no contiene un id_usuario válido.');
      return null;
    }
  } catch (error) {
    console.error('Error al decodificar el token JWT:', error);
    return null;
  }
};

/**
 * Obtiene el ID del usuario autenticado o lanza un error si el usuario no está autenticado.
 * 
 * @returns {string} El ID del usuario autenticado.
 * @throws {Error} Si el usuario no está autenticado (no se encuentra el token o es inválido).
 */
export const getAuthenticatedUserIdOrThrow = (): string => {
  const id_usuario = getAuthenticatedUserId();

  // Lanza un error si no se encuentra un usuario autenticado
  if (!id_usuario) {
    throw new Error('Usuario no autenticado');
  }

  return id_usuario;
};
