'use server';

import { createClient } from '@/utils/supabase/server';

/**
 * Obtiene la lista de moderadores desde la base de datos.
 */
export const fetchModerators = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id_usuario,
      nombre1,
      apellido1,
      correo,
      telefono,
      fecha_creacion
    `)
    .eq('id_tipo_usuario', 3); // Filtra solo moderadores (id_tipo_usuario = 3)

  if (error) {
    console.error('Error al obtener moderadores:', error);
    return [];
  }

  console.log('Moderadores obtenidos:', data);
  return data;
};
