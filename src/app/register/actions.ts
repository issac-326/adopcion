'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = createClient()

  // Obtén los valores de los campos
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string // confirmación de contraseña
  const phone = formData.get('phone') as string

  // Verifica que la contraseña y su confirmación coincidan
  if (password !== confirmPassword) {
    redirect('/error') // redirige a una página de error o muestra un mensaje
    return
  }

  const { error } = await supabase.auth.signUp({ email, password, phone })

  if (error) {
    redirect('/error')
    return
  }

  revalidatePath('/', 'layout')
  redirect('/home')
}
