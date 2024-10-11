'use server'

import { createClient } from '@/utils/supabase/server'


export const loginUser = async (formData: FormData) => {
  const supabase = createClient()

  const email = formData.get('email');
  const password = formData.get('password');

  
  // Realiza una consulta a la tabla users
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('correo', email)
    .eq('contrasena', password)
    .single();

  if (!data) {
    throw new Error('Credenciales incorrectas'); // Manejar caso de credenciales incorrectas
  }

  return data; // Retornar los datos del usuario autenticado
};
