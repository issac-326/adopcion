'use server';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';
import { redirect } from 'next/navigation';
import nodemailer from 'nodemailer';
import path from 'path';

export async function validateAdminAccess() {
  const userId = await getAuthenticatedUserIdOrThrow();
  const supabase = createClient();
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('id_tipo_usuario')
    .eq('id_usuario', userId)
    .single();
  if (error) {
    console.error('Error al obtener datos del usuario:', error);
    redirect('/login'); 
  }

  if (!user || ![1, 3].includes(user.id_tipo_usuario)) {
    redirect('/menu/inicio'); 
  }

  return true; 
}

export const fetchSupportReports = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reportes_soporte_prueba')
    .select(`
      id_reporte_soporte,
      descripcion,
      fecha_reporte,
      usuario:usuarios!id_usuario_reportador(nombre1, apellido1)
    `); 

  if (error) {
    console.error('Error al obtener los reportes de soporte:', error);
    return [];
  }

  console.log("Reportes de soporte obtenidos:", data);
  return data;
};

export const fetchUserReports = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reportes_usuarios')
    .select(`
      id_reporte_usuario,
      descripcion,
      fecha,
      reportador:usuarios!id_usuario_reportador(nombre1, apellido1, id_usuario, imagen, correo),
      reportado:usuarios!id_usuario_reportado(nombre1, apellido1, id_usuario, imagen, correo)
    `)
    .eq('trabajado', false);

  if (error) {
    console.error('Error al obtener los reportes de usuarios:', error);
    return [];
  }

  console.log("Reportes a usuarios obtenidos:", data);

  return data;
};

export const denegateReport = async (idReport: number, correo: string, razon: string) => {
  const supabase = createClient();
  const idModerador = await getAuthenticatedUserIdOrThrow();

  try {
    // Insertar razón en la tabla 'reportes_usuarios_trabajados'
    const { error: insertError } = await supabase
      .from('reportes_usuarios_trabajados')
      .insert({ id_reporte: idReport, comentario: razon, aprobado: false, id_moderador: idModerador });

    if (insertError) {
      console.error('Error al registrar el reporte trabajado:', insertError);
      throw new Error(`No se pudo registrar el reporte trabajado. Detalles: ${insertError.message}`);
    }

    try {
      // Cambiar el estado del reporte
      await changeReportStatus(idReport);
    } catch (statusError) {
      console.error('Error al cambiar el estado del reporte:', statusError);
      throw new Error('El estado del reporte no pudo ser actualizado.');
    }

    try {
      // Enviar el correo de denegación
      await sendDenegateEmail(correo);
    } catch (emailError) {
      console.error('Error al enviar el correo de denegación:', emailError);
      throw new Error('El correo de denegación no pudo ser enviado.');
    }
  } catch (error) {
    console.error('Error denegando el reporte:', error);
    throw error;
  }
};

export const approveReport = async (idReportedUser: number, idReport: number, correo: string, razon: string) => {
  const supabase = createClient();
  const idModerador = await getAuthenticatedUserIdOrThrow();

  try {
    // Incrementar el número de veces reportado
    const { error: rpcError } = await supabase.rpc('increment', {
      column_name: 'num_veces_reportado',
      amount: 1,
      id: idReportedUser,
    });

    if (rpcError) {
      console.error('Error al incrementar el número de veces reportado:', rpcError);
      throw new Error('No se pudo actualizar el número de veces reportado.');
    }

    // Insertar datos del reporte aprobado
    const { error: insertError } = await supabase
      .from('reportes_usuarios_trabajados')
      .insert({ id_reporte: idReport, id_moderador: idModerador, comentario: razon, aprobado: true });

    if (insertError) {
      console.error('Error al registrar el reporte aprobado:', insertError);
      throw new Error(`No se pudo registrar el reporte aprobado. Detalles: ${insertError.message}`);
    }

    try {
      // Cambiar el estado del reporte
      await changeReportStatus(idReport);
    } catch (statusError) {
      console.error('Error al cambiar el estado del reporte:', statusError);
      throw new Error('El estado del reporte no pudo ser actualizado.');
    }

    try {
      // Enviar el correo de aprobación
      await sendApprovalEmail(correo);
    } catch (emailError) {
      console.error('Error al enviar el correo de aprobación:', emailError);
      throw new Error('El correo de aprobación no pudo ser enviado.');
    }
  } catch (error) {
    console.error('Error aprobando el reporte:', error);
    throw error;
  }
};


const changeReportStatus = async (idReport: number) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('reportes_usuarios')
    .update({ trabajado: true })
    .eq('id_reporte_usuario', idReport) 
    .select(); 

  if (error) {
    console.error("Error al cambiar el estado del reporte:", error.message);
    throw new Error(`Error al cambiar el estado del reporte: ${error.message}`);
  }

  console.log("Reporte actualizado:", data); 
}

const sendApprovalEmail = async (email: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',   
    port: 465,               
    secure: true,      
    auth: {
      user: 'kennethcontreras2017@gmail.com',
      pass: 'zowf tume qmda mchc',
    },
  });

  // Cuerpo del correo con el mensaje de disculpas y aprobación
  const mailOptions = {
    from: '"Pet Finder" <noreply@petfinder.com>',
    to: email,
    subject: 'Confirmación de tu reporte',
    text: `Estimado usuario,\n\nLamentamos mucho la situación que has vivido recientemente en nuestra plataforma. Queremos que sepas que estamos trabajando para hacer de Pet Finder un espacio más seguro y ameno para todos. Nos alegra informarte que tu reporte ha sido aprobado exitosamente y tomaremos las medidas correspondientes para mejorar tu experiencia en nuestra comunidad.\n\nApreciamos tu paciencia y colaboración en este proceso. Gracias por ayudarnos a hacer de Pet Finder un mejor lugar.\n\nAtentamente,\nEl equipo de Pet Finder`,
    html: `<p>Estimado usuario,</p>
           <p>Lamentamos mucho la situación que has vivido recientemente en nuestra plataforma. Queremos que sepas que estamos trabajando para hacer de Pet Finder un espacio más seguro y ameno para todos. Nos alegra informarte que tu reporte ha sido aprobado exitosamente y tomaremos las medidas correspondientes para mejorar tu experiencia en nuestra comunidad.</p>
           <p>Apreciamos tu paciencia y colaboración en este proceso. Gracias por ayudarnos a hacer de Pet Finder un mejor lugar.</p>
           <p>Atentamente,<br/>El equipo de Pet Finder</p>`,
/*     attachments: [
            {
              filename: 'logo.png',
              path: path.join(__dirname, './public/LOGO_3.png'),
              cid: 'logo', // ID que usarás en el HTML
            },
          ], */
  };

  // Enviar el correo
  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de aprobación enviado exitosamente");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de aprobación.");
  }
};

const sendDenegateEmail = async (email: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'kennethcontreras2017@gmail.com',
      pass: 'zowf tume qmda mchc',
    },
  });

  const mailOptions = {
    from: '"Pet Finder" <noreply@petfinder.com>',
    to: email,
    subject: 'Reporte Denegado',
    text: `Estimado usuario,\n\nLamentamos informarte que tu reporte no ha sido aprobado tras una revisión exhaustiva. Agradecemos tu comprensión y te animamos a seguir contribuyendo a nuestra comunidad.\n\nAtentamente,\nEl equipo de Pet Finder`,
    html: `<p>Estimado usuario,</p>
           <p>Lamentamos informarte que tu reporte no ha sido aprobado tras una revisión exhaustiva. Agradecemos tu comprensión y te animamos a seguir contribuyendo a nuestra comunidad.</p>
           <p>Atentamente,<br/>El equipo de Pet Finder</p>`,
/*     attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, './public/LOGO_3.png'),
        cid: 'logo',
      },
    ], */
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de denegación enviado exitosamente");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de denegación.");
  }
};


