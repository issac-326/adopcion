'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import bcrypt from 'bcryptjs';

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
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



export async function addUser(formData: FormData, imageUrl: string | null) {
  try {
    const firstName = formData.get('firstName');
    const middleName = formData.get('middleName');
    const lastName1 = formData.get('lastName1');
    const lastName2 = formData.get('lastName2');
    const email = formData.get('email');
    const password = formData.get('password') as string;
    const phone = formData.get('phone');

    // Verificar si el usuario ya existe
    const supabase = createClient();
    const { data: existingUser, error: fetchError } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('correo', email);

    if (fetchError) throw fetchError;

    if (existingUser.length > 0) {
      throw new Error('El usuario ya existe');
    }

    // Si no existe, crear el nuevo usuario
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insertar el usuario con imagen predeterminada
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
        imagen: imageUrl  || "/usuario-default.jpg", // Imagen predeterminada
      }]);

    if (insertError) throw insertError;

    console.log('Usuario registrado:', data);
  } catch (error) {
    throw error;
  }
}


export const userExists = async (email: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('usuarios')
    .select('correo')
    .eq('correo', email)

    if (error) {
      throw error;
    }

    if (data.length > 0) {
      return true;
    }

    return false;
}