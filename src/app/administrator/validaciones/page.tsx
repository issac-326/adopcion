'use client';

import React, { useEffect, useState } from 'react';
import PetList from '@/components/ui/PetListAdmin';
import Pet from "@/types/Pet";
import { getValidaciones } from './actions';
import PetCardSkeleton from '@/components/ui/petCardSkeleton';

export default function Home() {
   

    const [validaciones, setValidaciones] = useState<Pet[]>([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);


    /**
     * Obtiene las publicaciones para validar.
     */
    const obtenerMascotaValidar = async () => {
        try {
            setLoadingFavorites(true);
            const data = await getValidaciones();
            setValidaciones(data ?? []);
        } catch (error) {
            console.error("Error al obtener Mascotas para validar:", error);
        } finally {
            setLoadingFavorites(false);
        }
    };

    // Efecto para cargar los favoritos del usuario autenticado al montar el componente
    useEffect(() => {
        obtenerMascotaValidar();
    }, []);


    return (
        <div className="min-h-screen bg-white p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="mt-5 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Validación de Mascotas</h1>
            </div>

            {/* Contenedor de la lista de mascotas con scroll oculto */}
            <div className="overflow-y-auto flex-grow scrollbar-hide">
                {loadingFavorites ? (
                    <>
                        <PetCardSkeleton />
                        <PetCardSkeleton />
                    </>
                ) : (
                    <PetList pets={validaciones} onDislike={obtenerMascotaValidar} />
                )}
            </div>
        </div>
    );
}