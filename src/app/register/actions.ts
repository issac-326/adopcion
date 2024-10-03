'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = createClient()
  const errors = []

  // Obtén los valores de los campos
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string // confirmación de contraseña
  const phone = formData.get('phone') as string

  // Verifica que la contraseña y su confirmación coincidan
  if (email === '') {
    errors.push('Email is required')
  }

  if (password === '') {
    errors.push('Password is required')
  }

  if (phone === '') {
    errors.push('Phone is required')
  }

  if (confirmPassword === '') {
    errors.push('Confirm password is required')
  }

  // Verifica que la contraseña tenga al menos 6 caracteres
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }

  // Verifica que la contraseña y su confirmación coincidan
  if (password !== confirmPassword) {
    errors.push('Passwords do not match')
    return
  }

  if(errors.length > 0) {
    redirect('/error')
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
