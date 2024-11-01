'use server';

import { createClient } from '@/utils/supabase/server';

// Función para obtener el perfil del usuario usando su ID
export const getUserProfile = async (userId: string) => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('nombre1, nombre2, apellido1, apellido2, telefono, correo, imagen') // Incluyendo el campo 'imagen'
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
      console.error('Error updating profile:', error);
      throw new Error('No se pudo actualizar el perfil');
    }

    return { message: 'Perfil actualizado correctamente' };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Error en el servidor al actualizar el perfil');
  }
};



// Función para actualizar la imagen de perfil del usuario

export async function imagenCloudinary(formData: FormData) {
  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

  try {
    formData.append('upload_preset', 'mascotas'); // En este caso estoy usando el preset que se usa en mascotas temporalmente

    const response = await fetch(cloudinaryUploadUrl, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return { data: data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: 'Error al subir la imagen'
      }
    };
  }
}


export const updateUserProfileImage = async (userId: string, imageUrl: string) => {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from('usuarios')
      .update({ imagen: imageUrl })
      .eq('id_usuario', userId);

    if (error) {
      console.error('Error updating profile image:', error);
      throw new Error('No se pudo actualizar la imagen de perfil');
    }

    return { message: 'Imagen de perfil actualizada correctamente' };
  } catch (error) {
    console.error('Error updating profile image:', error);
    throw new Error('Error en el servidor al actualizar la imagen de perfil');
  }
};

//funcion que trea las mascotas de este perfil
export const getMyPets = async (userId: string) => {
  const supabase = createClient();

  if (!userId) {
    throw new Error('El ID de usuario no fue proporcionado');
  }

  try {
    const { data, error } = await supabase
      .from('publicaciones')
      .select('id_publicacion, nombre, edad, ciudad, imagen , departamentos (descripcion)')
      .eq('id_usuario', '7');
     
    if (error) {
      console.error('Error updating profile:', error);
      throw new Error('No se pudo obtener las mascotas');
    }

    return data;
  } catch (error) {
    throw error;
  }
}; 
