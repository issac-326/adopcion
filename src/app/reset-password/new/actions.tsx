'use server'
import bcrypt from 'bcryptjs'
import { createClient } from '@/utils/supabase/server'

export const changePassword = async (formData : FormData, email : string) => {
  const supabase = createClient()

  const password = formData.get('password');
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const { data, error } = await supabase
    .from('usuarios')
    .update({ contrasena: hashedPassword })
    .eq('correo', email)

  if (error) {
    throw error; 
  }

  return data;
};