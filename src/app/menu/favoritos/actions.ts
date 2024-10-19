'use server'
import { createClient } from '@/utils/supabase/server';

const supabase = createClient();

// Verifica si la mascota ya está en favoritos para un usuario
export const verificacionFavoritos= async (id_publicacion: number, id_usuario: string) => {
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
