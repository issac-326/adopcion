'use client';

import PetInformation from '@/components/ui/PetInformation'; // Importamos el componente cliente

export default function MascotaPage({ params }) {
  const { id } = params; // Obtenemos el ID de la mascota desde la URL
  const id_usuario = 8; // Usuario fijo por ahora

  // Pasamos tanto el id de la mascota como el id_usuario fijo al componente PetInformation
  return <PetInformation id={id} id_usuario={id_usuario} />;
}