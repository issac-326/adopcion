'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

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


export const addUser = async (formData : FormData) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('usuarios')
    .insert([
      {
        correo: formData.get('email'),
        contrasena: formData.get('password'),
        telefono: formData.get('phone'),
      },
    ]);

  if (error) {
    throw error; // Lanzar el error para manejarlo en el componente
  }

  return data; // Retornar los datos de la inserción
};