'use server'
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function signup(formData: FormData) {
  const supabase = createClient()

  // Obtén los valores de los campos
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const phone = formData.get('phone') as string
  
  const { error } = await supabase.auth.signUp({ email, password, phone })

  if (error) {
    redirect('/error')
    return
  }

  if (error) {
    redirect('/error')
    return
  }

  revalidatePath('/', 'layout')
  redirect('/home')
}

