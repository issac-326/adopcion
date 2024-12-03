'use server'
import { createClient } from '@/utils/supabase/server';

import { getAuthenticatedUserIdOrThrow } from '@/utils/auth/auth';

/**
 * Reporta a un usuario en la base de datos.
 *
 * @param {number} idUsuarioReportado - ID del usuario que está siendo reportado.
 * @param {FormData} formData - Datos del formulario, debe incluir una clave `descripcion` con la descripción del reporte.
 * @returns {Promise<{ success: boolean, message: string, data?: any }>} - Resultado del proceso de reporte.
 * @throws {Error} - Lanza un error si falta la descripción, el ID es inválido, o si ocurre un problema al insertar el reporte.
 */
export const reportarUsuario = async (
  idUsuarioReportado: number, // Cambiado a número
  formData: FormData
): Promise<{ success: boolean; message: string; data?: any }> => {
  const idUsuarioReportador = Number(getAuthenticatedUserIdOrThrow()); // Convertir el ID autenticado a número
  const { descripcion } = Object.fromEntries(formData); // Extraer la descripción del formulario
  const fecha = new Date().toISOString(); // Generar fecha actual

  if (!descripcion) {
    throw new Error("La descripción del reporte es obligatoria.");
  }

  if (!idUsuarioReportado || typeof idUsuarioReportado !== "number") {
    throw new Error("El ID del usuario reportado debe ser un número válido.");
  }

  if (idUsuarioReportador === idUsuarioReportado) {
    throw new Error("No puedes reportarte a ti mismo.");
  }

  try {
    // Verificar si ya existe un reporte similar en las últimas 24 horas
    const { data: reportesExistentes, error: errorExistencia } = await supabase
      .from('reportes_usuarios')
      .select('*')
      .eq('id_usuario_reportador', idUsuarioReportador)
      .eq('id_usuario_reportado', idUsuarioReportado)
      .gte('fecha', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (errorExistencia) {
      console.error("Error al verificar reportes existentes:", errorExistencia);
      throw new Error("No se pudo verificar reportes previos.");
    }

    if (reportesExistentes && reportesExistentes.length > 0) {
      return {
        success: false,
        message: "Ya has reportado a este usuario en las últimas 24 horas.",
      };
    }

    // Insertar el nuevo reporte
    const { data, error } = await supabase
      .from('reportes_usuarios')
      .insert([
        {
          id_usuario_reportador: idUsuarioReportador,
          id_usuario_reportado: idUsuarioReportado,
          descripcion,
          fecha,
        },
      ])
      .select() // Agregamos .select() para obtener los datos insertados

    if (error) {
      console.error("Error al reportar usuario:", error);
      throw new Error("No se pudo enviar el reporte.");
    }

    return {
      success: true,
      message: "Reporte enviado con éxito.",
      data: data?.[0] // Devolvemos el primer registro insertado
    };
  } catch (error) {
    console.error("Error en la función reportarUsuario:", error);
    throw error;
  }
};


/**
 * Obtiene el ID del usuario autenticado.
 * 
 * @returns {string} El ID del usuario autenticado.
 */
export const getAuthenticatedUserIdForPage = (): string => {
  return getAuthenticatedUserIdOrThrow();
}

interface Publicacion {
  nombre: string;
  anios: number;
  meses: number;
  color: string;
  peso: number;
  vacunas: string;
  condicion_medica: string;
  imagen: string;
  ciudad: string;
  sexo: string;
  descripcion: string;
  departamentos: { descripcion: string }[]; // Ahora es un array
  usuarios: {
    nombre1: string;
    apellido1: string;
    imagen: string;
    id_usuario: number;
  }[]; // También es un array
  categorias: { 
    tipo_mascotas: string 
  }[]; // También es un array
  estado_adopcion: string;
  visible: boolean;
}


const supabase = createClient();

export const getMascotaEspecifica = async (id: number) => {

  const { data, error } = await supabase
  .from('publicaciones')
  .select(`
    nombre,
    anios,
    meses,
    color,
    peso,
    vacunas,
    condicion_medica,
    imagen,
    ciudad,
    sexo,
    descripcion,
    departamentos(descripcion),
    usuarios (nombre1, apellido1, imagen, id_usuario),
    categorias (tipo_mascotas),
    estado_adopcion,
    visible
  `)
  .eq('id_publicacion', id)
  .single(); // Obtener un solo registro

if (error) {
  console.error("Error fetching data:", error);
} else if (data) {
  const publicacion: Publicacion = data; // Asignamos el tipo Publicacion a los datos
  console.log("DATA en el backend:", publicacion);
}

  return data;
};


export async function insertarImagenesPorArray(urls: string[], idReporte: number) {
  const supabase = createClient();

  try {
    // Crear el arreglo de objetos a insertar
    const imagenes = urls.map((url) => ({
      url_img: url,
      id_reporte: idReporte, // Llave foránea
    }));

    // Realizar el insert en un solo llamado
    const { data, error } = await supabase
      .from('report_imagenes')
      .insert(imagenes);

    if (error) {
      console.error('Error al insertar imágenes:', error);
      throw new Error('Error al insertar imágenes en la base de datos');
    }

    console.log('Imágenes insertadas:', data);
    return data; // Retorna las filas insertadas
  } catch (error) {
    console.error('Error al insertar imágenes:', error);
    throw error;
  }
}