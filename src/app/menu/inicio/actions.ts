'use server'

import { createClient } from '@/utils/supabase/server';
import Pet from "@/types/Pet";

const supabase = createClient();

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

//Devuelve la mascota especifica por su categoria y su localizacion el id es la cat 
export const getCategoriaEspecifica = async (
    id: number = 0, 
    idDepartamento: number, 
    limit: number, 
    offset: number, 
    idUsuario: string
  ) => {
    console.log('ID recibido:', id, idDepartamento, limit, offset);
    
    // Base query
    let query = supabase
      .from('publicaciones')
      .select('id_publicacion, nombre, estado_adopcion, anios, meses , ciudad, imagen , departamentos (descripcion)')
      .eq('estado_adopcion', true)
      .eq('visible', true)
      .neq('id_usuario', idUsuario)
      .range(offset, offset + limit - 1); // Paginación
  
    // Caso 1: id === 0 && idDepartamento === 0 -> Todas las publicaciones
    if (id === 0 && idDepartamento === 0) {
      const { data, error } = await query;
  
      if (error) {
        console.error('Error al obtener publicaciones:', error);
        throw new Error(error.message);
      }
      return data;
    }
  
    // Caso 2: id !== 0 && idDepartamento === 0 -> Publicaciones de un tipo de animal (id), sin importar el departamento
    if (id !== 0 && idDepartamento === 0) {
      query = query.eq('tipo_animal', id);
    }
  
    // Caso 3: id !== 0 && idDepartamento !== 0 -> Publicaciones de un tipo de animal y de un departamento
    if (id !== 0 && idDepartamento !== 0) {
      query = query
        .eq('tipo_animal', id)
        .eq('id_departamento', idDepartamento);
    }
  
    // Caso 4: id === 0 && idDepartamento !== 0 -> Publicaciones de un departamento, sin importar el tipo de animal
    if (id === 0 && idDepartamento !== 0) {
      query = query.eq('id_departamento', idDepartamento);
    }
  
    // Ejecuta la consulta final
    const { data, error } = await query;
  
    if (error) {
      console.error('Error al obtener publicaciones:', error);
      throw new Error(error.message);
    }
  
    return data;
  };
  


export const getDepartamentos = async () => {

    const { data, error } = await supabase
        .from('departamentos')
        .select('*')

    if (error) {
        console.error('Error al obtener los departamentos:', error);
        throw new Error(error.message);
    }

    return data;
};