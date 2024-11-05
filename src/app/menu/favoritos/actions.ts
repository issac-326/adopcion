'use server'
import { createClient } from '@/utils/supabase/server';

const supabase = createClient();

// Verifica si la mascota ya está en favoritos para un usuario
export const verificacionFavoritos = async (id_publicacion: number, id_usuario: string) => {
  const { data, error } = await supabase
    .from('favoritos')
    .select('*')
    .eq('id_publicacion', id_publicacion)
    .eq('id_usuario', id_usuario)
    .single();

  if (error) return false; // No está en favoritos
  return data ? true : false; // Está en favoritos
};

// Añadir o eliminar un favorito
export const favorito = async (id_publicacion: number, id_usuario: string, isLiked: boolean) => {
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


export const getFavoritos = async (idUsuario: number) => {
  try {
    // Primero obtenemos los id_publicacion que están en favoritos para este usuario
    const { data: favoritosData, error: favoritosError } = await supabase
      .from('favoritos')
      .select('id_publicacion')
      .eq('id_usuario', idUsuario);

    if (favoritosError) {
      console.error('Error al obtener favoritos:', favoritosError);
      throw new Error(favoritosError.message);
    }

    // Extraemos solo los id_publicacion de los resultados
    const idsPublicacionesFavoritas = favoritosData.map(favorito => favorito.id_publicacion);

    // Ahora obtenemos las publicaciones que coinciden con estos ids y que tienen estado_adopcion = true
    const { data: publicacionesData, error: publicacionesError } = await supabase
      .from('publicaciones')
      .select('id_publicacion, nombre, estado_adopcion, anios, meses, ciudad, imagen, departamentos (descripcion)')
      .in('id_publicacion', idsPublicacionesFavoritas)

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
