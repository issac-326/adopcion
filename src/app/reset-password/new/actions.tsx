'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

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


export const changePassword = async (formData : FormData, email : string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .update({ password: formData.get('password') })
    .eq('email', email)

  if (error) {
    throw error; 
  }

  return data;
};