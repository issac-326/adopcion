'use server'

import bcrypt from 'bcryptjs';
import { createClient } from '@/utils/supabase/server'


/* export const loginUser = async (formData: FormData) => {
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
}; */

export async function loginUser(formData: FormData) {
  try {
    const supabase = createClient();

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('contrasena')
      .eq('correo', formData.get('email'))
      .single();

    if (!usuario || error) {
      throw new Error('Correo o contraseña incorrectos');
    }

    const isMatch = bcrypt.compareSync(formData.get('password'), usuario.contrasena);

    if (isMatch) {
      console.log('Contraseña correcta');
      return usuario;
    } else {
      throw new Error('Correo o contraseña incorrectos');
    }
  } catch (error) {
    console.error('Error al verificar usuario:', error);
    throw error;
  }
}
