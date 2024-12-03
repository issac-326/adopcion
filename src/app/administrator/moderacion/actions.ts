'use server';

import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';

/**
 * Registra un moderador en la base de datos.
 * @param formData Los datos del formulario enviados por el frontend.
 * @param imageUrl La URL de la imagen subida (opcional).
 */
export async function addModerator(formData: FormData, imageUrl: string | null) {
  try {
    const firstName = formData.get('firstName');
    const middleName = formData.get('middleName');
    const lastName1 = formData.get('lastName1');
    const lastName2 = formData.get('lastName2');
    const email = formData.get('email');
    const password = formData.get('password') as string;
    const phone = formData.get('phone');

    // Conectar con Supabase
    const supabase = createClient();

    // Validar si el correo ya existe
    const { data: existingUser, error: fetchError } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('correo', email);

    if (fetchError) throw fetchError;
    if (existingUser.length > 0) throw new Error('El usuario ya existe');

    // Cifrar la contraseña
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insertar el moderador
    const { data, error: insertError } = await supabase
      .from('usuarios')
      .insert([{
        nombre1: firstName,
        nombre2: middleName,
        apellido1: lastName1,
        apellido2: lastName2,
        correo: email,
        contrasena: hashedPassword,
        telefono: phone,
        imagen: imageUrl || "/usuario-default.webp",
        fecha_creacion: new Date().toISOString(),
        id_tipo_usuario: 3, // Moderador
      }]);

    if (insertError) throw insertError;

    console.log('Moderador registrado:', data);
    return data;
  } catch (error) {
    console.error('Error al registrar moderador:', error);
    throw error;
  }
}

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