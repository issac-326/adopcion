'use server'

import { createClient } from '@/utils/supabase/server';

const supabase = createClient();

export const getCategorias = async () => {

    const { data, error } = await supabase
        .from('categorias') 
        .select('*');

    if (error) {
        console.error('Error al obtener las categorias:', error);
        throw new Error(error.message);
    }

    return data;
};

export const getCategoriaEspecifica = async (id: number) => {
    console.log('ID recibido:', id);
    if(id===0) {
        const { data, error } = await supabase
        .from('publicaciones')
        .select('id_publicacion, nombre, edad, ciudad, imagen');
        if (error) {
            console.error('Error obtener mascotas:', error);
            throw new Error(error.message);
        }
        return data;
    }else {
        const { data, error } = await supabase
        .from('publicaciones') 
        .select('id_publicacion, nombre, edad, ciudad, imagen')
        .eq('tipo_animal', id);
        console.log("DATA en el backend:", data);
        return data;
    }
    
};