'use server'

import bcrypt from 'bcrypt'; 
import { createClient } from '@/utils/supabase/server';

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

  // Verificar la contraseña utilizando bcrypt
  const isPasswordValid = bcrypt.compareSync(password, data.contrasena);
  if (!isPasswordValid) {
    throw new Error('Credenciales incorrectas'); // Manejar caso de contraseña incorrecta
  }

  return data; // Retornar los datos del usuario autenticado
};
