'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';

const supabase = createClient();

/**
 * Obtiene el perfil del usuario autenticado.
 * @returns Los datos del perfil del usuario.
 * @throws Error si hay algún problema al obtener el perfil.
 */
export const getUserProfile = async () => {
  const userId = getAuthenticatedUserIdOrThrow();

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('nombre1, apellido1, imagen') // Incluyendo el campo 'imagen'
      .eq('id_usuario', userId) // Filtrar por el ID de usuario
      .single();

    if (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      throw new Error('No se pudo obtener el perfil del usuario');
    }

    return data; // Devuelve los datos del perfil
  } catch (error) {
    console.error('Error en el servidor al obtener el perfil del usuario:', error);
    throw new Error('Error en el servidor al obtener el perfil del usuario');
  }
};

/**
 * Obtiene las mascotas publicadas por el usuario autenticado.
 * @returns Lista de mascotas publicadas por el usuario.
 * @throws Error si hay algún problema al obtener las mascotas.
 */
export const getMyPets = async () => {
  const userId = getAuthenticatedUserIdOrThrow();

  try {
    const { data, error } = await supabase
      .from('publicaciones')
      .select('id_publicacion, nombre, anios, meses, ciudad, estado_adopcion, imagen , departamentos (descripcion), confirmacion')
      .eq('id_usuario', userId)
      .eq('visible', true)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      console.error('Error al obtener las mascotas:', error);
      throw new Error('No se pudo obtener las mascotas');
    }

    return data;
  } catch (error) {
    console.error('Error general en getMyPets:', error);
    throw new Error('Error en el servidor al obtener las mascotas');
  }
};

/**
 * Verifica si una publicación está en favoritos para el usuario autenticado.
 * @param id_publicacion - ID de la publicación a verificar.
 * @returns `true` si está en favoritos, `false` si no está.
 */
export const verificacionFavoritos = async (id_publicacion: number): Promise<boolean> => {
  const userId = getAuthenticatedUserIdOrThrow();

  const { data, error } = await supabase
    .from('favoritos')
    .select('*')
    .eq('id_publicacion', id_publicacion)
    .eq('id_usuario', userId)
    .single();

  return !error && Boolean(data);
};

/**
 * Añade o elimina una publicación de los favoritos del usuario autenticado.
 * @param id_publicacion - ID de la publicación.
 * @param isLiked - `true` para eliminar de favoritos, `false` para añadir a favoritos.
 * @throws Error si hay algún problema al añadir o eliminar el favorito.
 */
export const favorito = async (id_publicacion: number, isLiked: boolean): Promise<void> => {
  const userId = getAuthenticatedUserIdOrThrow();

  if (isLiked) {
    // Eliminar de favoritos
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('id_publicacion', id_publicacion)
      .eq('id_usuario', userId);

    if (error) throw new Error('Error al eliminar favorito');
  } else {
    // Añadir a favoritos
    const { error } = await supabase
      .from('favoritos')
      .insert({ id_publicacion, id_usuario: userId });

    if (error) throw new Error('Error al añadir favorito');
  }
};

/**
 * Obtiene las publicaciones que están en favoritos para el usuario autenticado.
 * @returns Lista de publicaciones en favoritos con detalles de cada publicación.
 * @throws Error si hay problemas al obtener los favoritos o las publicaciones.
 */
export const getFavoritos = async (): Promise<any[]> => {
  const userId = getAuthenticatedUserIdOrThrow();

  try {
    // Obtener los IDs de publicaciones que están en favoritos
    const { data: favoritosData, error: favoritosError } = await supabase
      .from('favoritos')
      .select('id_publicacion')
      .eq('id_usuario', userId);

    if (favoritosError) {
      console.error('Error al obtener favoritos:', favoritosError);
      throw new Error(favoritosError.message);
    }

    const idsPublicacionesFavoritas = favoritosData.map(favorito => favorito.id_publicacion);

    // Obtener detalles de las publicaciones favoritas
    const { data: publicacionesData, error: publicacionesError } = await supabase
      .from('publicaciones')
      .select('id_publicacion, nombre, anios, estado_adopcion, meses, ciudad, imagen, departamentos (descripcion)')
      .in('id_publicacion', idsPublicacionesFavoritas)
      .eq('estado_adopcion', true);

    if (publicacionesError) {
      console.error('Error al obtener publicaciones favoritas:', publicacionesError);
      throw new Error(publicacionesError.message);
    }

    return publicacionesData;
  } catch (error) {
    console.error('Error general en getFavoritos:', error);
    throw new Error('Error en el servidor al obtener favoritos');
  }
};
