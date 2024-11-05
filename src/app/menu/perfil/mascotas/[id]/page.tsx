'use client'

import PetInformation from '@/components/ui/PetInformation';

export default function MisMascotasPage({ params }) {
    const { id } = params; // Obtenemos el ID de la mascota desde la URL
    const userId = localStorage.getItem('userId');
  
  return (
    <div>
        <PetInformation id={id} id_usuario={userId} isMyPet={true} isInicio={false}/>
    </div>
  );
}