// utils/supabase/server.js

import { createClient } from '@/utils/supabase/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient();

export async function enviarReporte(formData: FormData) {
    const { descripcion } = Object.fromEntries(formData); // Extraer la descripción del formulario
    const fecha = new Date().toISOString(); // Obtener la fecha actual en formato ISO
    const id_usuario = null; // Cambia esto si tienes el ID del usuario

    const { data, error } = await supabase
        .from('reportes_soporte')
        .insert([{ descripcion, fecha, id_usuario }]); // Insertar en la tabla

    if (error) throw new Error(error.message); // Lanzar error si ocurre

    return data; // Retornar datos si la inserción es exitosa
}
