'use client'
import React, { useState, useEffect } from 'react';
import PetList from '@/components/ui/PetList';
import Pet from "@/types/Pet";



export default function Home() {
  const [selectedMascotas, setSelectedMascotas] = useState<Pet[]>([]);
  // Esta función recibirá las mascotas seleccionadas del prop
  const userId = localStorage.getItem('userId');


  return (
    < >

      <div className="mt-5 flex justify-between items-center">
        <h1 className="font-semibold">Favoritos</h1>
      </div>

      {/* Contenedor de la lista de mascotas con scroll oculto */}
      <div className="overflow-y-auto flex-grow scrollbar-hide">
        <PetList pets={selectedMascotas} />
      </div>
    </>

  );
}


