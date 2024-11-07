// utils/supabase/server.js
'use server';

import { createClient } from '@/utils/supabase/server';
const supabase = createClient();
import bcrypt from 'bcryptjs';

export const getUserProfile = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('usuarios') // Asegúrate de que 'users' sea el nombre correcto de tu tabla
            .select('*')
            .eq('id_usuario', userId)
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};


export async function enviarReporte(formData: FormData) {
    const supabase = createClient();

    const { descripcion } = Object.fromEntries(formData);
    const fecha = new Date().toISOString();
    const id_usuario = null;

    const { data, error } = await supabase
        .from('reportes_soporte')
        .insert([{ descripcion, fecha, id_usuario }]);

    if (error) throw new Error(error.message);

    return data;
}

// Cambia la contraseña del usuario en la base de datos

export const comparePasswords = async (password: string, userId: string) => {

    const supabase = createClient();

    const { data, error } = await supabase
        .from('usuarios') 
        .select('contrasena')
        .eq('id_usuario', userId)
        .single();

    if (error || !data) {
        throw new Error('Credenciales incorrectas'); 
    }

    // Compara la contraseña ingresada con la almacenada
    const isPasswordValid = await bcrypt.compare(password, data.contrasena);

    return isPasswordValid;
}

export const changePassword = async (newPassword: string, userId: string) => {
    const supabase = createClient();

    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    const { data, error } = await supabase
        .from('usuarios')
        .update({ contrasena: hashedNewPassword })
        .eq('id_usuario', userId);

    if (error) {
        throw new Error(error.message);
    }

    return data;

}


