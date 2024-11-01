'use server'
import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';

export async function addUser(formData: FormData) {
  try {
    const supabase = createClient();
    
    const user = {
      firstName: formData.get('firstName') as string,
      middleName: formData.get('middleName') as string,
      lastName1: formData.get('lastName1') as string,
      lastName2: formData.get('lastName2') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
      image: formData.get('image') as string,
    };

    // Verificar si el usuario ya existe
    const { data: existingUser, error: fetchError } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('correo', user.email);

    if (fetchError) throw fetchError;
    if (existingUser.length > 0) throw new Error('El usuario ya existe');

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);

    // Insertar el usuario
    // Insertar el usuario con imagen predeterminada
    const { data, error: insertError } = await supabase
      .from('usuarios')
      .insert([
        {
          nombre1: user.firstName,
          nombre2: user.middleName,
          apellido1: user.lastName1,
          apellido2: user.lastName2,
          correo: user.email,
          contrasena: hashedPassword,
          telefono: user.phone,
          imagen: user.image,
        },
      ]);

    if (insertError) throw insertError;
    console.log('Usuario registrado:', data);
  } catch (error) {
    throw error;
  }
}


