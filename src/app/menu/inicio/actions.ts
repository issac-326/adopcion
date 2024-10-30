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
export const getCategoriaEspecifica = async (id: number= 0, idDepartamento: number, limit: number, offset: number) => {
    console.log('ID recibido:', id, idDepartamento, limit, offset);
    let query = supabase
        .from('publicaciones')
        .select('id_publicacion, nombre, edad, ciudad, imagen , departamentos (descripcion)')
        .range(offset, offset + limit - 1); // Aquí añadimos la paginación

    if (id === 0 && idDepartamento === 0) {
        // Si no hay filtros (todos los registros)
        const { data, error } = await query;
        if (error) {
            console.error('Error al obtener mascotas:', error);
            throw new Error(error.message);
        }
        return data;
    }

    // Filtro por categoría de animal (tipo_animal) pero no por departamento
    if (idDepartamento === 0) {
        const { data, error } = await query.eq('tipo_animal', id);
        if (error) {
            console.error('Error al obtener mascotas:', error);
            throw new Error(error.message);
        }
        return data;
    }

    // Filtro por departamento sin categoría (todos los tipos de animal en ese departamento)
    if (id === 0) {
        const { data, error } = await query.eq('id_departamento', idDepartamento);
        if (error) {
            console.error('Error al obtener mascotas:', error);
            throw new Error(error.message);
        }
        return data;
    }

    // Filtro por categoría de animal y departamento
    const { data, error } = await query
        .eq('tipo_animal', id)
        .eq('id_departamento', idDepartamento);
    
    if (error) {
        console.error('Error al obtener mascotas:', error);
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