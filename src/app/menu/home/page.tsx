'use client'
import React, { useState, useEffect } from 'react';
import MenuCategorias from '@/components/MenuCategorias';
import PetList from '@/components/ui/PetList';
import Pet from "@/types/Pet";



export default function Home() {
  const [selectedMascotas, setSelectedMascotas] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false)

  // Esta función recibirá las mascotas seleccionadas del prop
  const manejarMascotas = (mascotas: Pet[]) => {
    setSelectedMascotas(mascotas);
  };

  return (
<div className="bg-white border my-2 mx-4 px-4 pb-4 h-screen rounded-xl shadow-[0_4px_8px_rgba(0,0,255,0.2),0_2px_4px_rgba(0,0,0,0.1)] flex flex-col">
  <MenuCategorias escogerMascotas={manejarMascotas} setLoadingPets={setLoading} />
  
  {/* Contenedor de la lista de mascotas con scroll oculto */}
  <div className="overflow-y-auto flex-grow scrollbar-hide">
    {loading ? }
    <PetList pets={selectedMascotas} />
  </div>
</div>




  );
}


