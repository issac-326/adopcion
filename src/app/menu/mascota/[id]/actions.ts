'use server'
import { createClient } from '@/utils/supabase/server';

import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';

/**
 * Obtiene el ID del usuario autenticado.
 * 
 * @returns {string} El ID del usuario autenticado.
 */
export const getAuthenticatedUserIdForPage = (): string => {
  return getAuthenticatedUserIdOrThrow();
}

interface Publicacion {
  nombre: string;
  anios: number;
  meses: number;
  color: string;
  peso: number;
  vacunas: string;
  condicion_medica: string;
  imagen: string;
  ciudad: string;
  sexo: string;
  descripcion: string;
  departamentos: { descripcion: string };
  usuarios: { nombre1: string; imagen: string };
  categorias: { tipo_mascotas: string };
  estado_adopcion: string;
  visible: boolean;
}

const supabase = createClient();

export const getMascotaEspecifica = async (id: number) => {

  const { data, error } = await supabase
  .from('publicaciones')
  .select(`
    nombre,
    anios,
    meses,
    color,
    peso,
    vacunas,
    condicion_medica,
    imagen,
    ciudad,
    sexo,
    descripcion,
    departamentos(descripcion),
    usuarios (nombre1, apellido1, imagen, id_usuario),
    categorias (tipo_mascotas),
    estado_adopcion,
    visible
  `)
  .eq('id_publicacion', id)
  .single(); // Obtener un solo registro

if (error) {
  console.error("Error fetching data:", error);
} else if (data) {
  const publicacion: Publicacion = data; // Asignamos el tipo Publicacion a los datos
  console.log("DATA en el backend:", publicacion);
}

  return data;
};