interface Pet {
  estado_adopcion: boolean;
  id_publicacion: number;
  nombre: string;
  anios: number;
  meses: number;
  ciudad: string;
  departamentos: {
    descripcion: string;
  } | null; // Si puede ser null en caso de que no haya coincidencias
  imagen: string;
}

export default Pet;
