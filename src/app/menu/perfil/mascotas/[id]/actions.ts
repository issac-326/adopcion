'use server'
import { createClient } from '@/utils/supabase/server';

const supabase = createClient();

export const getMascotaEspecifica = async (id: number) => {

  const { data, error } = await supabase
  .from('publicaciones')
  .select(`
    nombre,
    edad,
    color,
    peso,
    vacunas,
    condicion_medica,
    imagen,
    ciudad,
    sexo,
    descripcion,
    departamentos(descripcion),
    usuarios (nombre1, imagen),
    categorias (tipo_mascotas)
  `)
  .eq('id_publicacion', id)
  .single(); // Obtener un solo registro

if (error) {
  console.error("Error fetching data:", error);
} else if (data) {
  // @ts-expect-error
  const publicacion: Publicacion = data; // Asignamos el tipo Publicacion a los datos
  console.log("DATA en el backend:", publicacion);
}

  return data;
};

export const deleteMascota = async (id: number) => {
  const { error } = await supabase
    .from('publicaciones')
    .update({ visible : false })
    .eq('id_publicacion', id);

  if (error) {
    throw new Error(`Error deleting data: ${error.message}`);
  }
};

export const markAsAdopted = async (id: number) => {
  const { error } = await supabase
    .from('publicaciones')
    .update({ estado_adopcion: false })
    .eq('id_publicacion', id);

  if (error) {
    throw new Error(`Error updating data: ${error.message}`);
  }
};

