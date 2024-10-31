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
export const getCategoriaEspecifica = async (id: number, idDepartamento: number) => {
    console.log('ID recibido:', id);
    if (id === 0 && idDepartamento === 0) {
        const { data, error } = await supabase
            .from('publicaciones')
            .select('id_publicacion, nombre, edad, anios, meses, ciudad, imagen , departamentos (descripcion)')
            .eq('estado_adopcion', true);
        
        if (error) {
            console.error('Error obtener mascotas:', error);
            throw new Error(error.message);
        }
        return data;
    }
    //filtro mascotas pero en dep para todos
    if (idDepartamento === 0) {
        const { data, error } = await supabase
            .from('publicaciones')
            .select('id_publicacion, nombre, edad, anios, meses, ciudad, imagen , departamentos (descripcion)')
            .eq('tipo_animal', id)
            .eq('estado_adopcion', true);
        if (error) {
            console.error('Error obtener mascotas:', error);
            throw new Error(error.message);
        }
        return data;
    }
    //filtro para dep y categorias y depa y todos
    if (id === 0) {
        const { data, error } = await supabase
            .from('publicaciones')
            .select('id_publicacion, nombre, edad, anios, meses, ciudad, imagen , departamentos (descripcion)')
            .eq('id_departamento', idDepartamento)
            .eq('estado_adopcion', true);
        if (error) {
            console.error('Error obtener mascotas:', error);
            throw new Error(error.message);
        }
        return data;
    } else {
        const { data, error } = await supabase
        .from('publicaciones')
        .select('*, departamentos (descripcion)')
        .eq('tipo_animal', id)
        .eq('id_departamento', idDepartamento)
        .eq('estado_adopcion', true);
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

    return data;
};