'use client'
import React, { useState, useEffect } from 'react';
import MenuCategorias from '@/components/MenuCategorias';
import PetList from '@/components/ui/PetList';
import Pet from "@/types/Pet";



export default function Home() {
  const [selectedMascotas, setSelectedMascotas] = useState<Pet[]>([]);

  // Esta función recibirá las mascotas seleccionadas
  const manejarMascotas = (mascotas: Pet[]) => {
    setSelectedMascotas(mascotas);
  };

  return (
    <div className='bg-white border my-2 mx-4 px-4 rounded-xl shadow-md shadow-blue-500/30'>
      <MenuCategorias escogerMascotas={manejarMascotas} /> {/* Pasa la función */}
      <PetList pets={selectedMascotas} /> {/* Renderiza las mascotas seleccionadas */}
    </div>
  );
}


