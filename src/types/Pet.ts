interface Pet {
  id_publicacion: number;
  nombre: string;
  estado_adopcion: string;
  anios: number;
  meses: number;
  ciudad: string;
  imagen: string;
  departamentos: {
    descripcion: string;  // Asegúrate de que esto coincida con tu tipo Pet
  }[];
  confirmacion: number;
}


export default Pet;

