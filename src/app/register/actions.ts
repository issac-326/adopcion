'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = createClient()

  // Obtén los valores de los campos
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    phone : formData.get('phone') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/home')
  
}