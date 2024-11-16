'use client';

import React, { useEffect, useState } from 'react';
import PetList from '@/components/ui/PetList';
import Pet from "@/types/Pet";
import { getFavoritos } from './actions';
import PetCardSkeleton from '@/components/ui/petCardSkeleton';

export default function Home() {
  localStorage.setItem('selectedIndex', '1'); // Establece la pestaña seleccionada en "Favoritos"

  const [favoritos, setFavoritos] = useState<Pet[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  /**
   * Obtiene las publicaciones favoritas del usuario autenticado.
   */
  const obtenerFavoritosUsuario = async () => {
    try {
      setLoadingFavorites(true);
      const data = await getFavoritos(); // Llama directamente a la función de favoritos
      setFavoritos(data ?? []);
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  // Efecto para cargar los favoritos del usuario autenticado al montar el componente
  useEffect(() => {
    obtenerFavoritosUsuario();
  }, []);

  return (
    <div className='mx-4 my-4' >
      <div className="mt-5 flex justify-between items-center">
        <h1 className="font-semibold">Favoritos</h1>
      </div>

      {/* Contenedor de la lista de mascotas con scroll oculto */}
      <div className="overflow-y-auto flex-grow scrollbar-hide">
        {loadingFavorites ? (
          <>
            <PetCardSkeleton />
            <PetCardSkeleton />
          </>
        ) : (
          <PetList pets={favoritos} onDislike={obtenerFavoritosUsuario} isLikedP={true} />
        )}
      </div>
    </div>
  );
}
