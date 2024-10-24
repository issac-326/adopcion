// utils/supabase/server.js

import { createClient } from '@/utils/supabase/server';


export async function enviarReporte(formData: FormData) {
    const supabase = createClient();

    const { descripcion } = Object.fromEntries(formData); // Extraer la descripción del formulario
    const fecha = new Date().toISOString(); // Obtener la fecha actual en formato ISO
    const id_usuario = null; // Cambia esto si tienes el ID del usuario

    const { data, error } = await supabase
        .from('reportes_soporte')
        .insert([{ descripcion, fecha, id_usuario }]); // Insertar en la tabla

    if (error) throw new Error(error.message); // Lanzar error si ocurre

    return data; // Retornar datos si la inserción es exitosa
}