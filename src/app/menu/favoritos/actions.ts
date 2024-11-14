'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';

const supabase = createClient();

/**
 * Verifica si una publicación ya está en favoritos para el usuario autenticado.
 * @param id_publicacion - ID de la publicación a verificar.
 * @returns `true` si está en favoritos, `false` si no está.
 */
export const verificacionFavoritos = async (id_publicacion: number): Promise<boolean> => {
  const id_usuario = getAuthenticatedUserIdOrThrow();

  const { data, error } = await supabase
    .from('favoritos')
    .select('*')
    .eq('id_publicacion', id_publicacion)
    .eq('id_usuario', id_usuario)
    .single();

  return !error && Boolean(data); // Retorna true si la publicación está en favoritos
};

/**
 * Añade o elimina una publicación de los favoritos del usuario autenticado.
 * @param id_publicacion - ID de la publicación.
 * @param isLiked - `true` para eliminar de favoritos, `false` para añadir a favoritos.
 * @throws Error si hay algún problema al añadir o eliminar el favorito.
 */
export const favorito = async (id_publicacion: number, isLiked: boolean): Promise<void> => {
  const id_usuario = getAuthenticatedUserIdOrThrow();

  if (isLiked) {
    // Eliminar de favoritos
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('id_publicacion', id_publicacion)
      .eq('id_usuario', id_usuario);

    if (error) throw new Error('Error al eliminar favorito');
  } else {
    // Añadir a favoritos
    const { error } = await supabase
      .from('favoritos')
      .insert({ id_publicacion, id_usuario });

    if (error) throw new Error('Error al añadir favorito');
  }
};

/**
 * Obtiene las publicaciones que están en favoritos para el usuario autenticado.
 * @returns Lista de publicaciones en favoritos con detalles de cada publicación.
 * @throws Error si hay problemas al obtener los favoritos o las publicaciones.
 */
export const getFavoritos = async (): Promise<any[]> => {
  const id_usuario = getAuthenticatedUserIdOrThrow();

  try {
    // Obtener los IDs de publicaciones que están en favoritos
    const { data: favoritosData, error: favoritosError } = await supabase
      .from('favoritos')
      .select('id_publicacion')
      .eq('id_usuario', id_usuario);

    if (favoritosError) {
      console.error('Error al obtener favoritos:', favoritosError);
      throw new Error(favoritosError.message);
    }

    const idsPublicacionesFavoritas = favoritosData.map(favorito => favorito.id_publicacion);

    // Obtener detalles de las publicaciones favoritas
    const { data: publicacionesData, error: publicacionesError } = await supabase
      .from('publicaciones')
      .select('id_publicacion, nombre, estado_adopcion, anios, meses, ciudad, imagen, departamentos (descripcion)')
      .in('id_publicacion', idsPublicacionesFavoritas)
      .eq('estado_adopcion', true);

    if (publicacionesError) {
      console.error('Error al obtener publicaciones favoritas:', publicacionesError);
      throw new Error(publicacionesError.message);
    }

    return publicacionesData;
  } catch (error) {
    console.error('Error general en getFavoritos:', error);
    throw error;
  }
};
