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
    const password = formData.get('password');
    
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    const supabase = createClient()
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          correo: formData.get('email'),
          contrasena: hashedPassword, // Guarda la contraseña encriptada
          telefono: formData.get('phone'),
        },
      ]);

    if (error) throw error;
    console.log('Usuario registrado:', data);
  } catch (error) {
    console.error('Error registrando usuario:', error);
  }
}