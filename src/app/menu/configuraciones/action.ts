// utils/supabase/server.js
'use server';

import { createClient } from '@/utils/supabase/server';
const supabase = createClient();
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


import bcrypt from 'bcryptjs';

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
export const changePassword = async (formData: FormData) => {
    const supabase = createClient();
    
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');


    const { data: userData, error: fetchError } = await supabase
        .from('usuarios')
        .select('contrasena')
        .single();

    if (fetchError || !userData) {
        throw new Error(fetchError?.message || 'Usuario no encontrado');
    }


    const passwordMatch = bcrypt.compareSync(currentPassword, userData.contrasena);
    if (!passwordMatch) {
        throw new Error('La contraseña actual es incorrecta.');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    const { data: updateData, error: updateError } = await supabase
        .from('usuarios')
        .update({ contrasena: hashedNewPassword })
        .eq('contrasena', userData.contrasena);

    if (updateError) {
        throw new Error(updateError.message);
    }

    return updateData;
};

