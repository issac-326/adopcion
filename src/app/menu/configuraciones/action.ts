// utils/supabase/server.js
'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';
import bcrypt from 'bcryptjs';

const supabase = createClient();





/**
 * Obtiene el perfil del usuario autenticado desde la base de datos.
 * @returns Los datos del perfil del usuario autenticado.
 * @throws Error si ocurre algún problema al obtener los datos.
 */
export const getUserProfile = async (userId = getAuthenticatedUserIdOrThrow() ) => {
    try {
        const { data, error } = await supabase
            .from('usuarios') // Nombre de la tabla de usuarios
            .select('*')
            .eq('id_usuario', userId)
            .single();

        if (error) {
            console.error("Error al obtener el perfil del usuario:", error);
            throw new Error('No se pudo obtener el perfil del usuario');
        }

        return data;
    } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
        throw error;
    }
};


/**
 * Envía un reporte de soporte utilizando los datos del formulario.
 * @param formData - Objeto `FormData` que contiene la descripción del reporte.
 * @returns Los datos del reporte insertado en la base de datos.
 * @throws Error si ocurre algún problema al insertar el reporte.
 */
export const enviarReporte = async (formData: FormData) => {
    const userId = getAuthenticatedUserIdOrThrow(); // Asegúrate de que esta función devuelva el ID del usuario autenticado.
    const { descripcion } = Object.fromEntries(formData);
    const fecha_reporte = new Date().toISOString(); // Fecha actual en formato ISO


    const { data, error } = await supabase
        .from('reportes_soporte_prueba') 
        .insert([{ 
            descripcion, 
            fecha_reporte, 
            id_usuario_reportador: userId
        }]);

    if (error) {
        console.error("Error al enviar el reporte:", error);
        throw new Error(error.message); 
    }
    console.log("Datos enviados:", { descripcion, fecha_reporte, id_usuario_reportador: userId });

    return data; 
};



/**
 * Compara la contraseña proporcionada con la contraseña almacenada en la base de datos para el usuario autenticado.
 * @param password - Contraseña ingresada para verificar.
 * @returns `true` si la contraseña es correcta, `false` de lo contrario.
 * @throws Error si ocurre algún problema en la comparación de contraseñas.
 */
export const comparePasswords = async (password: string): Promise<boolean> => {
    const userId = getAuthenticatedUserIdOrThrow();

    const { data, error } = await supabase
        .from('usuarios')
        .select('contrasena')
        .eq('id_usuario', userId)
        .single();

    if (error || !data) {
        console.error("Error al comparar contraseñas:", error);
        throw new Error('Credenciales incorrectas');
    }

    // Compara la contraseña ingresada con la almacenada
    const isPasswordValid = await bcrypt.compare(password, data.contrasena);
    return isPasswordValid;
};

/**
 * Cambia la contraseña del usuario autenticado en la base de datos.
 * @param newPassword - Nueva contraseña a establecer para el usuario.
 * @returns Los datos del usuario actualizado.
 * @throws Error si ocurre algún problema al actualizar la contraseña.
 */
export const changePassword = async (newPassword: string) => {
    const userId = getAuthenticatedUserIdOrThrow();

    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    const { data, error } = await supabase
        .from('usuarios')
        .update({ contrasena: hashedNewPassword })
        .eq('id_usuario', userId);

    if (error) {
        console.error("Error al cambiar la contraseña:", error);
        throw new Error(error.message);
    }

    return data;
};



