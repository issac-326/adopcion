'use server'

import { createClient } from '@/utils/supabase/server'
import nodemailer from 'nodemailer'; // Importa Nodemailer
import crypto from 'crypto'; // Para generar el código
import { redirect } from 'next/navigation';

// Función para generar el código de restablecimiento (token)
function generateResetToken() {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); // Genera un código de 6 caracteres
}

export const searchUser = async (formData: FormData) => {
  const supabase = createClient();
  const email = formData.get('email')?.toString();

  // Busca al usuario en la base de datos por correo
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('correo', email)
    .single();

  if (!data) {
    throw new Error('El usuario no existe');
  }

  // Genera un código de restablecimiento
  const resetToken = generateResetToken();
  const tokenExpiry = new Date();
  tokenExpiry.setHours(tokenExpiry.getHours() + 1); // Código válido por 1 hora

  // Actualiza la base de datos con el código y su fecha de expiración
  const { dataUpdated, errorUpdated} = await supabase
    .from('usuarios')
    .update({ reset_token: resetToken })
    .eq('correo', email);

  if (errorUpdated) {
    throw new Error('Error al generar el código de restablecimiento');
  }

  console.log(dataUpdated);
  
  // Envía el correo al usuario con el código de restablecimiento
  await sendResetEmail(email, resetToken);

  return { message: 'Correo con código de restablecimiento enviado' };
};

// Función para enviar el correo de restablecimiento
async function sendResetEmail(email: string, resetToken: string) {
  // Configura el transporte de Nodemailer (aquí puedes usar tus credenciales SMTP)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',   // SMTP host correcto para Gmail
    port: 465,                // Puerto SMTP seguro para Gmail
    secure: true,      
    auth: {
      user: 'kennethcontreras2017@gmail.com',
      pass: 'zowf tume qmda mchc',
    },
  });

  // El cuerpo del correo con el código de restablecimiento
  const mailOptions = {
    from: '"Pet Finder" <noreply@petfinder.com>',
    to: email,
    subject: 'Código para restablecer tu contraseña',
    text: `Tu código de restablecimiento de contraseña es: ${resetToken}. Este código es válido por 1 hora.`,
    html: `<p>Tu código de restablecimiento de contraseña es:</p><h3>${resetToken}</h3><p>Este código es válido por 1 hora.</p>`,
  };

  // Enviar el correo
  await transporter.sendMail(mailOptions);
}