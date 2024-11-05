'use server';

import { createClient } from '@/utils/supabase/server';
import Publicaciones from '@/types/Publicaciones';

const supabase = createClient();

export async function getPet(id: string) {
    try {
        const { data, error } = await supabase
            .from('publicaciones')
            .select(`
              nombre,
              anios,
              meses,
              color,
              peso,
              imagen,
              sexo,
              descripcion,
              id_departamento,
              tipo_animal
            `)
            .eq('id_publicacion', id)
            .single();

        if (error) {
            throw new Error(`Error fetching publicacion: ${error.message}`);
        }

        return data;

    } catch (error) {
        throw error;
    }
}

export async function updatePet(formData: any, id: string) {
    console.log("formData", formData);
    try {
        const publicacion: Publicaciones = {
            peso: isNaN(Number(formData.peso)) ? 0 : Number(formData.peso),
            nombre: formData.nombre?.toString() || '',
            sexo: Number(formData.sexo) === 1, // Convierte a boolean
            tipo_animal: isNaN(Number(formData.tipoAnimal)) ? 0 : Number(formData.tipoAnimal),
            anos: isNaN(Number(formData.anos)) ? 0 : Number(formData.anos),
            meses: isNaN(Number(formData.meses)) ? 0 : Number(formData.meses),
            id_departamento: isNaN(Number(formData.departamento)) ? 0 : Number(formData.departamento),
            descripcion: formData.descripcion?.toString() || '',
            imagen: formData.imagen?.toString() || '',
        };

        const { data, error } = await supabase
            .from('publicaciones')
            .update({
                nombre: publicacion.nombre,
                anios: publicacion.anos,
                meses: publicacion.meses,
                peso: publicacion.peso,
                sexo: publicacion.sexo,
                descripcion: publicacion.descripcion,
                id_departamento: publicacion.id_departamento,
                tipo_animal: publicacion.tipo_animal,
                imagen: publicacion.imagen
            })
            .eq('id_publicacion', Number(id) || 0);

        if (error) {
            throw new Error(`Error updating publicacion: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error("Error en la actualización:", error);
        throw error;
    }
}
