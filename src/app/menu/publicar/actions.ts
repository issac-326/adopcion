'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';
import Publicaciones from '@/types/Publicaciones';

interface UploadResponse {
  avatarUrl: string;
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
  original_extension: string;
}

/**
 * Sube una imagen a Cloudinary y devuelve la respuesta de la subida.
 * @param formData - Los datos del formulario que contienen la imagen.
 * @returns Un objeto con los datos de la imagen subida o un mensaje de error.
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
    return { data: data as UploadResponse, error: null };
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    return {
      data: null,
      error: {
        message: 'Error al subir la imagen',
      },
    };
  }
}

/**
 * Crea una nueva publicación con los datos proporcionados.
 * @param formData - Los datos del formulario de la publicación.
 * @throws Error si ocurre un problema al insertar la publicación en la base de datos.
 */
export async function crearPublicacion(formData: FormData) {
  const supabase = createClient();
  const userId = getAuthenticatedUserIdOrThrow();

  try {
    // Crea el objeto de la publicación con los datos necesarios
    const publicacion: Publicaciones = {
      id_usuario: userId,
      fecha_creacion: new Date().toISOString(),
      peso: Number(formData.get('peso')),
      nombre: formData.get('nombre') as string,
      sexo: Number(formData.get('sexo')) === 1,
      tipo_animal: Number(formData.get('tipoAnimal')),
      anos: Number(formData.get('anos')),
      meses: Number(formData.get('meses')),
      id_departamento: Number(formData.get('departamento')),
      descripcion: formData.get('descripcion') as string,
      imagen: formData.get('imagen') as string,
    };

    console.log('Datos de la publicación:', publicacion);

    // Inserta la publicación en la tabla 'publicaciones' de Supabase
    const { data, error: insertError } = await supabase
      .from('publicaciones')
      .insert([
        {
          nombre: publicacion.nombre,
          peso: publicacion.peso,
          id_usuario: publicacion.id_usuario,
          tipo_animal: publicacion.tipo_animal,
          sexo: publicacion.sexo,
          descripcion: publicacion.descripcion,
          id_departamento: publicacion.id_departamento,
          imagen: publicacion.imagen,
          anios: publicacion.anos,
          meses: publicacion.meses,
          fecha_creacion: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      console.error('Error al crear publicación:', insertError);
      throw new Error('Error al crear publicación en la base de datos');
    }

    console.log('Publicación registrada:', data);
    return data; // Retorna los datos de la publicación creada
  } catch (error) {
    console.error('Error al crear publicación:', error);
    throw error;
  }
}
