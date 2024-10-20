'use server'

import { createClient } from '@/utils/supabase/server';

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

    console.log('Categorias obtenidas:', data);
    return data;
};

export const getCategoriaEspecifica = async (id: number, idDepartamento: number) => {
    console.log('ID recibido:', id);
    if (id === 0) {
        const { data, error } = await supabase
            .from('publicaciones')
            .select('id_publicacion, nombre, edad, ciudad, imagen')
            .eq('id_departamento', idDepartamento);
        if (error) {
            console.error('Error obtener mascotas:', error);
            throw new Error(error.message);
        }
        return data;
    } else {
        const { data, error } = await supabase
            .from('publicaciones')
            .select('id_publicacion, nombre, edad, ciudad, imagen')
            .eq('tipo_animal', id)
            .eq('id_departamento', idDepartamento);
        console.log("DATA en el backend:", data);
        return data;
    }

};

export const getDepartamentos = async () => {

    const { data, error } = await supabase
        .from('departamentos')
        .select('*')

    if (error) {
        console.error('Error al obtener los departamentos:', error);
        throw new Error(error.message);
    }

    console.log('Departamentos obtenidos:', data);
    return data;
};