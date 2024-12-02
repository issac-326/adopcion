'use server';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';

/**
 * Verifica si el usuario tiene acceso general a la sección /administrator.
 */
export async function validateGeneralAccess() {
  try {
    const userId = await getAuthenticatedUserIdOrThrow();

    const supabase = createClient();
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id_tipo_usuario')
      .eq('id_usuario', userId)
      .single();

    if (error || !user) {
      return { status: 0, role: null }; // Usuario no autenticado
    }

    const roleMap: Record<number, string> = {
      1: 'admin',
      2: 'user',
      3: 'moderator',
    };

    const role = roleMap[user.id_tipo_usuario] || 'unknown';

    // Validar si el usuario pertenece a /administrator
    if (role === 'admin' || role === 'moderator') {
      return { status: 2, role }; // Usuario autorizado para /administrator
    }

    return { status: 1, role }; // Usuario autenticado pero no autorizado para /administrator
  } catch (error) {
    console.error('Error al validar acceso general:', error);
    return { status: 0, role: null }; // Fallback en caso de error
  }
}

/**
 * Verifica si el usuario tiene permisos específicos para acceder a una página.
 * @param allowedRoles - Roles permitidos para la página.
 */
export async function validatePageAccess(allowedRoles: number[]) {
    try {
      const userId = await getAuthenticatedUserIdOrThrow();
  
      const supabase = createClient();
      const { data: user, error } = await supabase
        .from('usuarios')
        .select('id_tipo_usuario')
        .eq('id_usuario', userId)
        .single();
  
      if (error || !user) {
        return { status: 0, role: null }; // Usuario no autenticado
      }
  
      const userRole = user.id_tipo_usuario;
  
      // Verificar si el rol está permitido para esta página
      if (!allowedRoles.includes(userRole)) {
        return { status: 1, role: userRole }; // Usuario autenticado pero sin permisos para la página
      }
  
      return { status: 2, role: userRole }; // Usuario autorizado para la página
    } catch (error) {
      console.error('Error al validar acceso a la página:', error);
      return { status: 0, role: null }; // Fallback en caso de error
    }
  }
  