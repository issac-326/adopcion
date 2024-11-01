'use server'

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
        .single(); // Obtener un solo registro

        if(error) {
            throw new Error("Error fetching publicacion:", error);
        }

        return data;

    } catch (error) {
        throw error;
    }


}

export async function updatePet(formData: any, id: string) {
    const publicacion: Publicaciones = {
        peso: Number(formData.peso), // Convierte a número
        nombre: formData.nombre as string,
        sexo: Number(formData.sexo) == 1, // Convierte a número y compara
        tipo_animal: Number(formData.tipoAnimal), // Convierte a número
        anos: Number(formData.anos), // Convierte a número
        meses: Number(formData.meses), // Convierte a número
        id_departamento: Number(formData.departamento), // Convierte a número
        descripcion: formData.descripcion as string,
        imagen: formData.imagen as string, // Asegúrate de que esto sea la URL correcta
      };
    
        try {
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
                tipo_animal: publicacion.tipo_animal
            })
            .eq('id_publicacion', id);
    
            if(error) {
                throw new Error("Error updating publicacion:", error);
            }
    
            return true;
    
        } catch (error) {
            throw error;
        }
    
    }