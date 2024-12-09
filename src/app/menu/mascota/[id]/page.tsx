'use client'

import PetInformation from '@/components/ui/PetInformation'; // Importamos el componente cliente
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuthenticatedUserIdForPage } from './actions';

interface Params {
  id: string;
}

export default function MascotaPage({ params }: { params: Params }) {
  const router = useRouter();
  const { id } = params; // Obtenemos el ID de la mascota desde la URL
   // Obtiene el ID del usuario autenticado desde el servidor
   const userId = getAuthenticatedUserIdForPage();
  const [isInicio, setIsInicio] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      setIsInicio(Boolean(queryParams.get('inicio')));
    }
  }, []);

  return (
    <div>
      <PetInformation id={id} isInicio={isInicio} id_usuario={userId}/>
    </div>
  );
}
