'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth'; // Importa la función de autenticación

const supabase = createClient();

/**
 * Obtiene todas las categorías ordenadas por `id_categoria`.
 * @returns Lista de categorías.
 * @throws Error si hay problemas al obtener las categorías.
 */
export const getCategorias = async () => {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('id_categoria', { ascending: true }); // Ordenar por id_categoria

  if (error) {
    console.error('Error al obtener las categorias:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Obtiene publicaciones específicas por categoría, ubicación, y excluyendo las del usuario autenticado.
 * @param id - ID de la categoría (0 para todas).
 * @param idDepartamento - ID del departamento (0 para todos).
 * @param limit - Límite de publicaciones a devolver.
 * @param offset - Desplazamiento para la paginación.
 * @returns Lista de publicaciones filtradas.
 * @throws Error si el usuario no está autenticado o si ocurre algún problema con la consulta.
 */
export const getCategoriaEspecifica = async (
  id: number = 0,
  idDepartamento: number,
  limit: number,
  offset: number
) => {
  const idUsuario = getAuthenticatedUserIdOrThrow(); // Obtiene el ID del usuario autenticado

  console.log('ID recibido:', id, idDepartamento, limit, offset);

  // Construye la consulta base
  let query = supabase
    .from('publicaciones')
    .select('id_publicacion, nombre, estado_adopcion, anios, meses, ciudad, imagen, departamentos (descripcion)')
    .eq('estado_adopcion', true)
    .eq('visible', true)
    .neq('id_usuario', idUsuario)
    .range(offset, offset + limit - 1); // Paginación

  // Aplica filtros condicionales
  if (id !== 0) query = query.eq('tipo_animal', id);
  if (idDepartamento !== 0) query = query.eq('id_departamento', idDepartamento);

  // Ejecuta la consulta final
  const { data, error } = await query;

  if (error) {
    console.error('Error al obtener publicaciones:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Obtiene todos los departamentos.
 * @returns Lista de departamentos.
 * @throws Error si hay problemas al obtener los departamentos.
 */
export const getDepartamentos = async () => {
  const { data, error } = await supabase
    .from('departamentos')
    .select('*');

  if (error) {
    console.error('Error al obtener los departamentos:', error);
    throw new Error(error.message);
  }

  return data;
};
