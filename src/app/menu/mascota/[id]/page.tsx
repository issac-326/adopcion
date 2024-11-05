'use client'

import PetInformation from '@/components/ui/PetInformation'; // Importamos el componente cliente
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MascotaPage({ params }) {
  const router = useRouter();
  const { id } = params; // Obtenemos el ID de la mascota desde la URL
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null; // Verificar si estamos en cliente antes de acceder a localStorage
  const [isInicio, setIsInicio] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      setIsInicio(Boolean(queryParams.get('inicio')));
      console.log('isInicio:', isInicio);
    }
  }, []);

  return (
    <div>
      <PetInformation id={id} isInicio={isInicio} userId={userId}/>
    </div>
  );
}
