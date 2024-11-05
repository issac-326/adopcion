'use server'

import { createClient } from '@/utils/supabase/server'
import Publicaciones from '@/types/Publicaciones';

interface UploadResponse {
    avatarUrl: string
    asset_id: string
    public_id: string
    version: number
    version_id: string
    signature: string
    width: number
    height: number
    format: string
    resource_type: string
    created_at: string
    tags: string[]
    pages: number
    bytes: number
    type: string
    etag: string
    placeholder: boolean
    url: string
    secure_url: string
    folder: string
    access_mode: string
    original_filename: string
    original_extension: string
  }
  
export async function imagenCloudinary (formData: FormData) {
    const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  
    try {
      formData.append('upload_preset', 'mascotas')
  
      const response = await fetch(cloudinaryUploadUrl, {
        method: 'POST',
        body: formData
      })
  
      const data = await response.json()
      return { data: data as UploadResponse, error: null }
    } catch (error) {
      return {
        data: null,
        error: {
          message: `
                    Error al subir la imagen
                  `
        }
      }
    }
  }


  // Función que valida los datos del formulario y envía los datos al servidor
  export async function crearPublicacion(formData: FormData, userId: string) {
    try {
      const publicacion: Publicaciones = {
        id_usuario: userId,
        fecha_creacion: new Date().toISOString(),
        peso: Number(formData.get('peso')), // Convierte a número
        nombre: formData.get('nombre') as string,
        sexo: Number(formData.get('sexo')) === 1, // Convierte a número
        tipo_animal: Number(formData.get('tipoAnimal')), // Convierte a número
        anos: Number(formData.get('anos')), // Convierte a número
        meses: Number(formData.get('meses')), // Convierte a número
        id_departamento: Number(formData.get('departamento')), // Convierte a número
        descripcion: formData.get('descripcion') as string,
        imagen: formData.get('imagen') as string, // Asegúrate de que esto sea la URL correcta
      };
      
  
      const supabase = createClient();
  
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
        ]); // Asegúrate de pasar el objeto publicacion
  
      if (insertError) throw insertError;
  
      console.log('Publicación registrada:', data);
    } catch (error) {
      console.error('Error al crear publicación:', error);
      throw error;
    }
  }
  
  