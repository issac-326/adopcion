'use client';

import React, { useState, useEffect } from 'react';
import { getMascotaEspecifica } from '@/app/menu/mascota/[id]/actions';
import { verificacionFavoritos, favorito } from '@/app/menu/favoritos/actions';
import Image from 'next/image';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faLocationDot, faPaw } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import PetInformationSkeleton  from '@/components/ui/PetInformationSkeleton';

export default function PetInformation({ id, id_usuario }: { id: string, id_usuario: string }) {
  const [isLiked, setIsLiked] = useState(false);
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        const data = await getMascotaEspecifica(Number(id));
        setMascota(data);
        const liked = await verificacionFavoritos(Number(id), id_usuario);
        setIsLiked(liked);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar la mascota:', error);
      }
    };

    fetchMascota();
  }, [id, id_usuario]);

  const handleLike = async () => {
    try {
      await favorito(Number(id), id_usuario, isLiked);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    }
  };

  console.log('mascota', mascota)
  if (!mascota) return <PetInformationSkeleton />;

  return (
    <div className="bg-white min-h-screen flex flex-col lg:flex-row-reverse p-5">
      {/* Imagen de la mascota */}
      <div className="flex-1 flex justify-center items-center rounded-br-[50px] mt-8 lg:mt-0">
        <Image
          src={mascota.imagen}
          alt="Mascota"
          width={300}
          height={300}
          className="shadow-[0_0px_15px_rgba(0,0,0,0.8)] rounded-lg sm:w-[200px] sm:h-[200px] lg:w-[500px] lg:h-[500px]"
        />
      </div>

      {/* Información */}
      <div className="flex-1 flex flex-col justify-between p-8">
        {/* Botón para regresar */}
        <div className="rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center cursor-pointer hover:scale-110" onClick={() => { router.push('/menu/inicio') }}>
          <button className="ml-[20px] lg:ml-[30px]">
            <FontAwesomeIcon icon={faAngleLeft} className="text-red-500 text-[24px] lg:text-[32px]" />
          </button>
        </div>

        <div className="flex-1 p-8 pt-2 flex flex-col">
          {/* Nombre y ubicación */}
          <div className="flex justify-between items-center">
            <div className="p-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{mascota.nombre}</h1>
              <div className="text-gray-500 flex items-center">
                <FontAwesomeIcon icon={faLocationDot} className="text-blue-500 mr-2 sm:text-sm" />
                {mascota.ciudad}, {mascota.departamentos.descripcion}
              </div>
            </div>
            <button className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full bg-white shadow-[0_0px_7px_rgba(0,0,0,0.6)]  cursor-pointer" onClick={handleLike}>
              <FontAwesomeIcon
                icon={faHeart}
                className={`text-[16px] sm:text-[20px] lg:text-[25px] ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
              />
            </button>
          </div>

          {/* Descripción y detalles */}
          <div className="flex flex-col lg:flex-row justify-between mt-8">
            <div className="flex-1 bg-green-200 p-3 rounded-lg relative hover:scale-110 transition-transform mr-4 mb-4 lg:mb-0">
              <h2 className="font-bold">{mascota.sexo ? "Macho" : "Hembra"}</h2>
              <p className="text-xs text-gray-500">Sexo</p>
              <FontAwesomeIcon icon={faPaw} className="absolute top-5 right-4 text-green-500 opacity-30 rotate-[-30deg] text-[30px] sm:text-[40px]" />
            </div>
            <div className="flex-1 bg-orange-200 p-3 rounded-lg relative hover:scale-110 transition-transform mr-4 mb-4 lg:mb-0">
              <h2 className="font-bold">{mascota.edad} años</h2>
              <p className="text-xs text-gray-500">Edad</p>
              <FontAwesomeIcon icon={faPaw} className="absolute top-5 right-4 text-orange-500 opacity-30 rotate-[-30deg] text-[30px] sm:text-[40px]" />
            </div>
            <div className="flex-1 bg-blue-200 p-3 rounded-lg relative hover:scale-110 transition-transform">
              <h2 className="font-bold">{mascota.peso} kg</h2>
              <p className="text-xs text-gray-500">Peso</p>
              <FontAwesomeIcon icon={faPaw} className="absolute top-5 right-4 text-blue-500 opacity-30 rotate-[-30deg] text-[30px] sm:text-[40px]" />
            </div>
          </div>

          {/* Descripción general */}
          <div className="mt-8 mb-8 text-sm sm:text-base">
            <div><span className="font-semibold">Color:</span> {mascota.color || 'Indefinido'}</div>
            {mascota.vacunas !== null && (
              <div><span className="font-semibold">Vacunas:</span> {mascota.vacunas ? 'Sí' : 'No'}</div>
            )}
            {mascota.condicion_medica && (
              <div><span className="font-semibold">Condición Médica:</span> {mascota.condicion_medica}</div>
            )}
            <div><span className="font-semibold">Especie:</span> {mascota.categorias.tipo_mascotas || 'Indefinido'}</div>
            <div className="text-base mt-4"><span className="font-semibold">Descripción:</span> {mascota.descripcion || 'Indefinido'}</div>
          </div>

          {/* Dueño */}
          <div className="flex items-center mb-6">
            <div className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] lg:w-[60px] lg:h-[60px] overflow-hidden rounded-full">
              <Image
                src={mascota.usuarios.imagen}
                alt="Propietario"
                width={60}
                height={60}
                className="object-cover"
              />
            </div>
            <div className="ml-4">
              <p className="font-bold">{mascota.usuarios.nombre1}</p>
              <p className="text-gray-500">Propietario</p>
            </div>
          </div>
        </div>

        {/* Botón de Adoptar */}
        <div>
          <button className="w-full sm:w-full lg:w-3/5 py-2 sm:py-3 bg-orange-300 text-white rounded-3xl text-sm sm:text-lg hover:bg-orange-400 transition-colors mx-auto block" onClick={() => { router.push(`/menu/mensaje`) }}>
            Adoptar
          </button>
        </div>
      </div>
    </div>
  );
}
