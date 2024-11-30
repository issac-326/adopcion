'use server';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';
import { redirect } from 'next/navigation';
export async function validateAdminAccess() {
  const userId = await getAuthenticatedUserIdOrThrow();
  const supabase = createClient();
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('id_tipo_usuario')
    .eq('id_usuario', userId)
    .single();
  if (error) {
    console.error('Error al obtener datos del usuario:', error);
    redirect('/login'); 
  }

  if (!user || ![1, 3].includes(user.id_tipo_usuario)) {
    redirect('/menu/inicio'); 
  }

  return true; 
}


export const fetchSupportReports = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reportes_soporte_prueba')
    .select(`
      id_reporte_soporte,
      descripcion,
      fecha_reporte,
      usuario:usuarios!id_usuario_reportador(nombre1, apellido1)
    `); 

  if (error) {
    console.error('Error al obtener los reportes de soporte:', error);
    return [];
  }

  console.log("Reportes de soporte obtenidos:", data);
  return data;
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
    `); 

  if (error) {
    console.error('Error al obtener los reportes de usuarios:', error);
    return [];
  }

  console.log("Reportes a usuarios obtenidos:", data);

  return data;
};
