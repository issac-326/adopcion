// 'use server'
import { createClient } from '@/utils/supabase/server';

const supabase = createClient();

export const getMascotaEspecifica = async (id: number) => {
  const { data, error } = await supabase
    .from('publicaciones') 
    .select('id_publicacion, nombre, edad, ciudad, imagen, sexo, peso, descripcion, dueño')
    .eq('id_publicacion', id)
    .single(); // Obtener un solo registro

  if (error) {
    console.error('Error al obtener la mascota:', error);
    throw new Error(error.message);
  }

  return data;
};
