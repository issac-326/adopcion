'use server';


import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';
import { redirect } from 'next/navigation';
// import nodemailer from 'nodemailer';


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
        usuario:usuarios!id_usuario_reportador(nombre1, apellido1, correo, imagen)
      `)
      .order('fecha_reporte', { ascending: false }); // Orden descendente por fecha_reporte
 
    if (error) {
      console.error('Error al obtener los reportes de soporte:', error);
      return [];
    }
 
    console.log("Reportes de soporte obtenidos:", data);
    return data;
  };






  export const approveReport = async (idReport: number) => {
    const supabase = createClient();
    const idModerador = await getAuthenticatedUserIdOrThrow();
    if (!idReport || typeof idReport !== 'number') {
      console.error('El ID del reporte no es válido:', idReport);
      return { success: false, error: 'ID de reporte inválido' };
    }
    try {
      const { error: insertError } = await supabase
        .from('reporte_soporte_estado')
        .insert([
          {
            id_reporte: idReport,
            id_moderador: idModerador,
            aprobado: true,
            fecha: new Date().toISOString(),
          },
        ]);
 
      if (insertError) {
        console.error('Error al aprobar la solicitud', insertError);
        return { success: false, error: insertError.message };
      }
 
      console.log('Reporte aprobado');
      return { success: true };
    } catch (error) {
      console.error('Error desconocido al aprobar el reporte', error);
      return { success: false, error: 'Error desconocido' };
    }
  };
 
  export const denegateReport = async (idReport: number) => {
    const supabase = createClient();
    const idModerador = await getAuthenticatedUserIdOrThrow();
 
    try {
      const { error } = await supabase
        .from('reporte_soporte_estado')
        .insert([
          {
            id_reporte: idReport,
            id_moderador: idModerador,
            aprobado: false,
            fecha: new Date().toISOString(),
          },
        ]);
 
      if (error) {
        console.error('Error al denegar el reporte', error);
        return { success: false, error: error.message };
      }
 
      console.log('Reporte denegado');
      return { success: true };
    } catch (error) {
      console.error('Error desconocido al denegar el reporte', error);
      return { success: false, error: 'Error desconocido' };
    }
  };
