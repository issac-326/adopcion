'use server';

import { createClient } from '@/utils/supabase/server';

// Función para obtener el perfil del usuario usando su ID
export const getUserProfile = async (userId: string) => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('usuarios') 
      .select('nombre1, nombre2, apellido1, apellido2, telefono')
      .eq('id_usuario', userId) // Filtrar por el ID de usuario
      .single();

    if (error) {
      throw new Error('Error fetching user profile');
    }

    return data; // Devuelve los datos del perfil
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
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
    throw new Error('User ID not found');
  }

  try {
    const { error } = await supabase
      .from('usuarios') 
      .update({
        nombre1: updatedData.nombre1,
        nombre2: updatedData.nombre2,
        apellido1: updatedData.apellido1,
        apellido2: updatedData.apellido2,
        telefono: updatedData.telefono,
      })
      .eq('id_usuario', userId); // Actualizar usando el ID del usuario

    if (error) {
      throw new Error('Error updating profile');
    }

    return { message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
