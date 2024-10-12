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
    if(id===0) {
        const { data, error } = await supabase
        .from('categorias') 
        .select('*');

        if (error) {
            console.error('Error obtener mascotas:', error);
            throw new Error(error.message);
        }
        return data;
    }else {
        const { data, error } = await supabase
            .from('categorias') 
            .select('*')
            .eq('id_categoria', id)
            .single();

        if (error) {
            console.error('Error obtener mascotas:', error);
            throw new Error(error.message);
        }
        return data;
    }
    
};