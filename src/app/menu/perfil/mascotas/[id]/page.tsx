'use client'

import PetInformation from '@/components/ui/PetInformation';

export default function MisMascotasPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const userId = localStorage.getItem('userId') as string;
  
    return (
        <div>
            <PetInformation 
                id={id} 
                id_usuario={userId} 
                isMyPet={true} 
                isInicio={false}
            />
        </div>
    );
}