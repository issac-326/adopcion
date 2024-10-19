
'use client';

import Link from "next/link";
import React, { useState, useEffect } from 'react';// Para obtener el ID de la ruta
import { getMascotaEspecifica } from '@/app/menu/mascota/[id]/actions';// Importa la función del servidor
import { verificacionFavoritos, favorito } from '@/app/menu/favoritos/actions';
import Image from 'next/image';
import { faHeart } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono específico
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faLocationDot, faPaw } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation"


// Definición de los tipos de los datos que obtienes de Supabase
interface Publicacion {
    nombre: string;
    edad: number;
    color: string;
    peso: number;
    vacunas: boolean | null; // Puede ser null si no tiene vacunas
    condicion_medica: string | null; // Puede ser null si no tiene una condición médica
    imagen: string;
    ciudad: string;
    sexo: boolean;
    descripcion: string;
    usuarios: {
      nombre1: string;
      imagen: string;
    };
    categorias: {
      tipo_mascotas: string;
    };
  }
  

export default function PetInformation({ id, id_usuario }: { id: string, id_usuario: string }) {
    const [isLiked, setIsLiked] = useState(false);
    const [mascota, setMascota] = useState(null); 
    const [loading, setLoading] = useState(true);  
    const router = useRouter()

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        const data = await getMascotaEspecifica(Number(id)); // Llama a la función del servidor
        setMascota(data);
        // Verificar si ya está en favoritos
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
      setIsLiked(!isLiked); // Alterna el estado después de guardar/eliminar
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    }
  };


  if (!mascota) return <div>Cargando...</div>;
  return (
    <div className="flex p-5 h-screen">
      {/* Información */}
      <div className="flex-1 p-8 flex flex-col justify-between bg-white rounded-tr-[50px] rounded-br-[50px] shadow-[0px_5px_20px_rgba(0,0,0,0.4)]">
        {/* Botón para regresar */}
        <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,0.4)] cursor-pointer hover:scale-110" onClick={() => {router.push('/menu/inicio')}}>
          <button>
            <FontAwesomeIcon icon={faAngleLeft} className="text-red-500 text-[25px]" />
          </button>
        </div>

        <div className="flex-1 p-8 flex flex-col">
          {/* Nombre y ubicación */}
          <div className="flex justify-between items-center">
            <div className="p-5">
              <h1 className="text-3xl font-bold mb-2">{mascota.nombre}</h1>
              <div className="text-gray-500 flex items-center">
                <FontAwesomeIcon icon={faLocationDot} className="text-blue-500 mr-2" />
                {mascota.ciudad}
              </div>
            </div>
            <button className="w-14 h-14 rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.4)] cursor-pointer" onClick={handleLike}>
                <FontAwesomeIcon 
                  icon={faHeart} 
                  className={`text-[25px] ${isLiked ? 'text-red-500' : 'text-gray-400'}`} 
                />
              </button>
          </div>

          {/* Descripción y detalles */}
          <div className="flex justify-between mt-8">
            <div className="flex-1 bg-green-200 p-3 rounded-lg relative hover:scale-110 transition-transform mr-4">
              <h2 className="font-bold">{mascota.sexo ? "Macho" : "Hembra"}</h2>
              <p className="text-xs text-gray-500">Sexo</p>
              <FontAwesomeIcon
                icon={faPaw}
                className="absolute top-5 right-4 text-green-500 opacity-30 rotate-[-30deg] text-[40px]"
              />
            </div>
            <div className="flex-1 bg-orange-200 p-3 rounded-lg relative hover:scale-110 transition-transform mr-4">
              <h2 className="font-bold">{mascota.edad} años</h2>
              <p className="text-xs text-gray-500">Edad</p>
              <FontAwesomeIcon
                icon={faPaw}
                className="absolute top-5 right-4 text-orange-500 opacity-30 rotate-[-30deg] text-[40px]"
              />
            </div>
            <div className="flex-1 bg-blue-200 p-3 rounded-lg relative hover:scale-110 transition-transform">
              <h2 className="font-bold">{mascota.peso} kg</h2>
              <p className="text-xs text-gray-500">Peso</p>
              <FontAwesomeIcon
                icon={faPaw}
                className="absolute top-5 right-4 text-blue-500 opacity-30 rotate-[-30deg] text-[40px]"
              />
            </div>
          </div>
          <div className="mt-8 mb-8">
  {/* Color de la mascota */}
  <div className="text-sm">
    <span className="text-gray-500">Color:</span> <span className="text-gray-600">{mascota.color || 'Indefinido'}</span>
  </div>

  {/* Vacunas, solo si no es nulo */}
  {mascota.vacunas !== null && (
    <div className="text-sm">
      <span className="text-gray-500">Vacunas:</span> <span className="text-gray-600">{mascota.vacunas ? 'Sí' : 'No'}</span>
    </div>
  )}

  {/* Condición Médica, solo si no es nulo */}
  {mascota.condicion_medica && (
    <div className="text-sm">
      <span className="text-gray-500">Condición Médica:</span> <span className="text-gray-600">{mascota.condicion_medica}</span>
    </div>
  )}

  {/* Especie de la mascota */}
  <div className="text-sm">
    <span className="text-gray-500">Especie:</span> <span className="text-gray-600">{mascota.categorias.tipo_mascotas || 'Indefinido'}</span>
  </div>

  {/* Descripción */}
  <div className="text-base mt-4">
    <span className="text-gray-500">Descripción:</span> <span className="text-gray-600">{mascota.descripcion || 'Indefinido'}</span>
  </div>
</div>



          {/* Imagen y nombre del dueño */}
          <div className="flex items-center mb-6">
          <div className="w-[60px] h-[60px] overflow-hidden rounded-full">
          <Image
            src={mascota.usuarios.imagen}
            alt="Propietario"
            width={60}
            height={60}
            className="object-cover"
          />
        </div>

            <div className="ml-4">
              <p className="font-bold"> {mascota.usuarios.nombre1} </p>
              <p className="text-gray-500 flex items-center">Propietario</p>
            </div>
          </div>
        </div>

        {/* Botón de Adoptar */}
        <div>
        <button className="w-3/5 py-3 bg-orange-300 text-white rounded-3xl text-lg hover:bg-orange-400 transition-colors mx-auto block" key={id} onClick={() => {router.push(`/menu/mensaje`) }}>
        Adoptar
        </button>


        </div>
      </div>

      {/* Lado derecho Imagen de la mascota */}
      <div className="flex-1 flex justify-center items-center rounded-br-[50px]">
        <Image
          src={mascota.imagen}
          alt="Mascota"
          width={500}
          height={500}
          className="shadow-[5px_5px_15px_rgba(0,0,0,0.9)] rounded-lg"
        />
      </div>
    </div>
  );
};

