'use server';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';
import { redirect } from 'next/navigation';
export async function validateAdminAccess() {
  // Obtén el ID del usuario autenticado desde el token JWT
  const userId = await getAuthenticatedUserIdOrThrow();
  // Crear cliente de Supabase
  const supabase = createClient();
  // Consultar la información del usuario
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('id_tipo_usuario')
    .eq('id_usuario', userId)
    .single();
  if (error) {
    console.error('Error al obtener datos del usuario:', error);
    redirect('/login'); // Redirige al login si ocurre un error
  }
  // Verificar si el usuario tiene rol de administrador
  if (!user || ![1, 3].includes(user.id_tipo_usuario)) {
    redirect('/menu/inicio'); // Redirige si no es administrador
  }

  return true; // Devuelve true si el usuario es administrador
}


export const fetchSupportReports = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('reportes_soporte')
    .select(`
      id_reporte_soporte,
      descripcion,
      fecha,
      usuario:usuarios(nombre1, apellido1)
    `);

  if (error) {
    console.error("Error al obtener los reportes de soporte:", error);
    return [];
  }

  console.log("Reportes de soporte obtenidos:", data);
  return data || [];
};


export const fetchUserReports = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reportes_usuarios')
    .select(`
      id_reporte_usuario,
      descripcion,
      fecha,
      reportador:usuarios!id_usuario_reportador(nombre1, apellido1),
      reportado:usuarios!id_usuario_reportado(nombre1, apellido1)
    `); // Relación con los usuarios reportador y reportado

  if (error) {
    console.error('Error al obtener los reportes de usuarios:', error);
    return [];
  }

  console.log("Reportes a usuarios obtenidos:", data);
  // Retorna los datos directamente
  return data;
};
