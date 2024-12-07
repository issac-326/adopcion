'use server';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

/**
 * Autentica a un usuario basado en los datos de formulario recibidos.
 * Realiza la verificación de credenciales, genera un token JWT y configura una cookie para la sesión.
 * 
 * @param formData - Objeto `FormData` con el correo y la contraseña del usuario.
 * @returns Los datos del usuario autenticado si las credenciales son válidas.
 * @throws Error si las credenciales son incorrectas o si ocurre algún problema en el proceso.
 */
export const loginUser = async (formData: FormData) => {
  const supabase = createClient();

  // Obtiene el correo y la contraseña desde el formulario
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Verifica que ambos campos existan
  if (!email || !password) {
    throw new Error('Correo y contraseña son requeridos');
  }

  // Realiza una consulta en la tabla `usuarios` para encontrar el usuario por correo
  const { data, error } = await supabase
    .from('usuarios')
    .select('id_usuario, correo, contrasena,id_tipo_usuario, habilitado')
    .eq('correo', email)
    .single();

  // Maneja el caso de error o usuario no encontrado
  if (error || !data) {
    throw new Error('Credenciales incorrectas');
  }

  // Compara la contraseña ingresada con la almacenada en la base de datos
  const isPasswordValid = await bcrypt.compare(password, data.contrasena);
  if (!isPasswordValid) {
    throw new Error('Credenciales incorrectas');
  }


  if(!data.habilitado){
    throw new Error('Usuario deshabilitado');
  }
  // Genera un token JWT con el `id_usuario` como payload y una expiración de 1 hora
  const token = jwt.sign({ id_usuario: data.id_usuario }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  // Configura una cookie HTTP-only para almacenar el token JWT
  cookies().set({
    name: 'authToken',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60, // 1 hora
    path: '/',
  });

  // Retorna los datos del usuario autenticado
  return data;
};