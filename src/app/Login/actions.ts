'use server';

import { createClient } from '@/utils/supabase/server'
import bcrypt from 'bcrypt';

export const loginUser = async (formData: FormData) => {
  const supabase = createClient();

  const email = formData.get('email');
  const password = formData.get('password');

  // Realiza una consulta a la tabla usuarios
  const { data, error } = await supabase
    .from('usuarios') // Asegúrate de que el nombre de la tabla sea correcto
    .select('id_usuario, correo, contrasena') // Seleccionamos 'id_usuario', 'correo' y 'contrasena'
    .eq('correo', email)
    .single();

  if (error || !data) {
    throw new Error('Credenciales incorrectas'); // Manejar caso de credenciales incorrectas
  }

  // Comparar la contraseña ingresada con la contraseña encriptada
  const isMatch = await bcrypt.compare(password, data.contrasena);
  if (!isMatch) {
    throw new Error('Credenciales incorrectas'); // Manejar caso de credenciales incorrectas
  }

  return data; // Retornar los datos del usuario autenticado
};
