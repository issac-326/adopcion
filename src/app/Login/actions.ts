'use server';

import { createClient } from '@/utils/supabase/server';

export const loginUser = async (formData: FormData) => {
  const supabase = createClient();

  const email = formData.get('email');
  const password = formData.get('password');

  // Realiza una consulta a la tabla usuarios
  const { data, error } = await supabase
    .from('usuarios') // Asegúrate de que el nombre de la tabla sea correcto
    .select('id_usuario, correo') // Seleccionamos 'id_usuario' y 'correo'
    .eq('correo', email)
    .eq('contrasena', password)
    .single();

  if (error || !data) {
    throw new Error('Credenciales incorrectas'); // Manejar caso de credenciales incorrectas
  }

  return data; // Retornar los datos del usuario autenticado
};
