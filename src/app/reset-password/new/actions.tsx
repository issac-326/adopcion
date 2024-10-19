'use server'

import { createClient } from '@/utils/supabase/server'

export const changePassword = async (formData : FormData, email : string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('usuarios')
    .update({ contrasena: formData.get('password')?.toString() })
    .eq('correo', email)

    console.log('PW', formData.get('password')?.toString())
    console.log(email)
  if (error) {
    throw error; 
  }

  return data;
};