'use server'

import bcrypt from 'bcrypt'; // Asegúrate de importar bcrypt
import { createClient } from '@/utils/supabase/server';

export const loginUser = async (formData: FormData) => { 
  const supabase = createClient();

  const email = formData.get('email');
  const password = formData.get('password') as string;

  // Realiza una consulta a la tabla usuarios
  const { data, error } = await supabase
    .from('usuarios') 
    .select('id_usuario, correo, contrasena') 
    .eq('correo', email)
    .single();

  if (error || !data) {
    throw new Error('Credenciales incorrectas'); 
  }

  // Compara la contraseña ingresada con la almacenada
  const isPasswordValid = await bcrypt.compare(password, data.contrasena);
  
  if (!isPasswordValid) {
    throw new Error('Credenciales incorrectas'); 
  }
// se borro_
  return data; 
};
