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

export async function addUser(formData: FormData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');
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
          correo: email,
          contrasena: hashedPassword,
          telefono: phone,
          imagen: '/usuario-default.jpg', // Imagen predeterminada
      }]);

    if (insertError) throw insertError;

    console.log('Usuario registrado:', data);
  } catch (error) {
    throw error;
  }
}


