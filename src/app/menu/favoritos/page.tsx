'use client';
import React, { useEffect, useState } from 'react';
import PetList from '@/components/ui/PetList';
import Pet from "@/types/Pet";
import { getFavoritos } from './actions';
import PetCardSkeleton from '@/components/ui/petCardSkeleton';

export default function Home() {
  localStorage.setItem('selectedIndex', '1'); 
  const [favoritos, setFavoritos] = useState<Pet[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const obtenerFavoritosUsuario = async () => {
    const userId = localStorage.getItem('userId'); // Obtener el userId de localStorage
    if (!userId) {
      console.error("No se encontró el userId en localStorage.");
      return;
    }

    try {
      setLoadingFavorites(true);
      const data = await getFavoritos(parseInt(userId)); // Convertir a número si es necesario
      setFavoritos(data ?? []);
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  useEffect(() => {
    obtenerFavoritosUsuario();
  }, []);

  return (
    <>
      <div className="mt-5 flex justify-between items-center">
        <h1 className="font-semibold">Favoritos</h1>
      </div>

      {/* Contenedor de la lista de mascotas con scroll oculto */}
      <div className="overflow-y-auto flex-grow scrollbar-hide">
        {loadingFavorites ? <><PetCardSkeleton /><PetCardSkeleton /></> : <PetList pets={favoritos} onDislike={obtenerFavoritosUsuario} isLikedP={true} />
        }
      </div>
    </>
  );
}
