'use server';

import { createClient } from '@/utils/supabase/server';

// Función para obtener el perfil del usuario usando su ID
export const getUserProfile = async (userId: string) => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('usuarios') // Asegúrate de que el nombre de la tabla sea correcto
      .select('nombre1, nombre2, apellido1, apellido2, telefono, correo') // Incluyendo el campo 'correo'
      .eq('id_usuario', userId) // Filtrar por el ID de usuario
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('No se pudo obtener el perfil del usuario');
    }

    return data; // Devuelve los datos del perfil
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Error en el servidor al obtener el perfil del usuario');
  }
};

// Función para actualizar el perfil del usuario
export const updateUserProfile = async (userId: string, updatedData: {
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  telefono: string;
}) => {
  const supabase = createClient();

  if (!userId) {
    throw new Error('El ID de usuario no fue proporcionado');
  }

  try {
    const { error } = await supabase
      .from('usuarios') // Asegúrate de que el nombre de la tabla sea correcto
      .update({
        nombre1: updatedData.nombre1,
        nombre2: updatedData.nombre2,
        apellido1: updatedData.apellido1,
        apellido2: updatedData.apellido2,
        telefono: updatedData.telefono,
      })
      .eq('id_usuario', userId); // Actualizar usando el ID del usuario

    if (error) {
      console.error('Error updating profile:', error);
      throw new Error('No se pudo actualizar el perfil');
    }

    return { message: 'Perfil actualizado correctamente' };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Error en el servidor al actualizar el perfil');
  }
};