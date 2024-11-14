'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';

/**
 * Obtiene el perfil del usuario autenticado.
 * @returns Datos del perfil del usuario.
 * @throws Error si no se puede obtener el perfil.
 */
export const getUserProfile = async () => {
  const supabase = createClient();
  const userId = getAuthenticatedUserIdOrThrow();

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('nombre1, nombre2, apellido1, apellido2, telefono, correo, imagen')
      .eq('id_usuario', userId)
      .single();

    if (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      throw new Error('No se pudo obtener el perfil del usuario');
    }

    return data;
  } catch (error) {
    console.error('Error en el servidor al obtener el perfil del usuario:', error);
    throw new Error('Error en el servidor al obtener el perfil del usuario');
  }
};

/**
 * Actualiza los datos del perfil del usuario autenticado.
 * @param updatedData - Objeto con los datos actualizados del perfil.
 * @returns Un mensaje de éxito si la actualización es exitosa.
 * @throws Error si no se puede actualizar el perfil.
 */
export const updateUserProfile = async (updatedData: {
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  telefono: string;
}) => {
  const supabase = createClient();
  const userId = getAuthenticatedUserIdOrThrow();

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
      .eq('id_usuario', userId);

    if (error) {
      console.error('Error al actualizar el perfil:', error);
      throw new Error('No se pudo actualizar el perfil');
    }

    return { message: 'Perfil actualizado correctamente' };
  } catch (error) {
    console.error('Error en el servidor al actualizar el perfil:', error);
    throw new Error('Error en el servidor al actualizar el perfil');
  }
};

/**
 * Sube una imagen a Cloudinary y devuelve la URL de la imagen subida.
 * @param formData - FormData que contiene los datos de la imagen.
 * @returns URL de la imagen subida o un mensaje de error.
 */
export async function imagenCloudinary(formData: FormData) {
  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

  try {
    formData.append('upload_preset', 'mascotas');

    const response = await fetch(cloudinaryUploadUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.secure_url) {
      return { data: data.secure_url, error: null };
    } else {
      throw new Error('Error al obtener la URL segura de la imagen');
    }
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    return {
      data: null,
      error: {
        message: 'Error al subir la imagen',
      },
    };
  }
}

/**
 * Actualiza la imagen de perfil del usuario autenticado en la base de datos.
 * @param imageUrl - URL de la nueva imagen de perfil.
 * @returns Un mensaje de éxito si la actualización es exitosa.
 * @throws Error si no se puede actualizar la imagen de perfil.
 */
export const updateUserProfileImage = async (imageUrl: string) => {
  const supabase = createClient();
  const userId = getAuthenticatedUserIdOrThrow();

  try {
    const { error } = await supabase
      .from('usuarios')
      .update({ imagen: imageUrl })
      .eq('id_usuario', userId);

    if (error) {
      console.error('Error al actualizar la imagen de perfil:', error);
      throw new Error('No se pudo actualizar la imagen de perfil');
    }

    return { message: 'Imagen de perfil actualizada correctamente' };
  } catch (error) {
    console.error('Error en el servidor al actualizar la imagen de perfil:', error);
    throw new Error('Error en el servidor al actualizar la imagen de perfil');
  }
};
