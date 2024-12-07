'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';

const supabase = createClient();

export const getValidaciones = async (): Promise<any[]> => {
  const id_usuario = getAuthenticatedUserIdOrThrow();
  try {
    
    // Obtener detalles de las publicaciones favoritas
    const { data: publicacionesData, error: publicacionesError } = await supabase
      .from('publicaciones')
      .select('id_publicacion, nombre, estado_adopcion, anios, meses, ciudad, imagen, departamentos (descripcion)')
      .eq('estado_adopcion', true)
      .eq('confirmacion', 3);

    if (publicacionesError) {
      console.error('Error al obtener publicaciones para validar:', publicacionesError);
      throw new Error(publicacionesError.message);
    }

    return publicacionesData;
  } catch (error) {
    console.error('Error general en getValidaciones:', error);
    throw error;
  }
};

export const actualizarConfirmacion = async (id_publicacion: number, nuevoEstado: number): Promise<void> => {
  try {
    // Actualizar el estado de confirmación
    const { data, error } = await supabase
      .from('publicaciones')
      .update({ confirmacion: nuevoEstado })
      .eq('id_publicacion', id_publicacion); // Filtrar por el id de la publicación
    if (error) {
      console.error('Error al actualizar el estado de confirmación:', error);
      throw new Error(error.message);
    }

    console.log('Estado de confirmación actualizado con éxito:', data);
  } catch (error) {
    console.error('Error general en actualizarConfirmacion:', error);
    throw error;
  }
 
};
