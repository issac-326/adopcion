'use client'

import * as React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMapMarkerAlt, faCheckCircle, faHourglassHalf, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { verificacionFavoritos, favorito } from '@/app/menu/favoritos/actions';
import { useEffect, useState } from "react";
import { on } from "events";
import { IconProp } from "@fortawesome/fontawesome-svg-core";


interface InputProps { // Propiedades que recibe el componente
  id: number; // Debe ser un número
  nombre: string;
  anios: number;
  meses: number;
  ciudad: string;
  imagen: string;
  footerBg: string;
  svgBg: string;
  isMyPet: boolean;
  disponible: boolean;
  isInicio?: boolean;
  onDislike?: () => void;
  isLikedP?: boolean;
  confirmacion?: number;
}

const PetCard = ({
  nombre,
  ciudad,
  imagen,
  id,
  anios,
  meses,
  footerBg,
  svgBg,
  isMyPet = false,
  disponible,
  isInicio = true,
  onDislike,
  isLikedP = false,
  confirmacion
}: InputProps) => {
  const router = useRouter();
  const userId = localStorage.getItem('userId');
  const [isLiked, setIsLiked] = useState(isLikedP);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        // Verificar si ya está en favoritos
        {/*@ts-expect-error */ }
        const liked = await verificacionFavoritos(Number(id), userId);
        setIsLiked(liked);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar favorito:', error);
      }
    };

    fetchMascota();
  }, [id, userId]);

  const handleLike = async () => {
    try {
      {/*@ts-expect-error */ }
      await favorito(Number(id), userId, isLiked);
      setIsLiked(!isLiked);
      if (isLiked) {
        onDislike?.();
      }
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    }
  };

  return (
    <div
      className={`flex flex-col cursor-pointer hover:scale-102 transition-transform duration-300 relative w-full h-[272px] rounded-lg shadow-lg overflow-hidden 
    ${!disponible || confirmacion == 2 || confirmacion == 3 ? 'opacity-80 grayscale-[80%]' : 'border'}`}
      key={id}
      onClick={() =>
        router.push(isMyPet
          ? `/menu/perfil/mascotas/${id}`
          : `/menu/mascota/${id}?inicio=${isInicio}`
        )
      }
    >
      <header className="relative h-4/5 overflow-hidden">
        <Image
          src={imagen}
          alt="perro"
          className={`object-cover ${!disponible ? 'blur-[2px]' : ''}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />

        {!disponible && confirmacion === 1 && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-60 flex flex-col items-center justify-center">
            <FontAwesomeIcon icon={faCheckCircle as IconProp} className="text-white text-6xl mb-2 animate-bounce" />
            <span className="text-white text-3xl font-extrabold animate-bounce">¡Adoptado!</span>
          </div>
        )}

        {confirmacion === 3 && (
          <div className="absolute inset-0 bg-yellow-500 bg-opacity-60 flex flex-col items-center justify-center">
            <FontAwesomeIcon icon={faHourglassHalf as IconProp} className="text-white text-6xl mb-2 animate-pulse" />
            <span className="text-white text-3xl font-extrabold animate-pulse">En revisión</span>
          </div>
        )}

        {confirmacion === 2 && (
          <div className="absolute inset-0 bg-red-600 bg-opacity-70 flex flex-col items-center justify-center">
            <FontAwesomeIcon icon={faTimesCircle as IconProp} className="text-white text-6xl mb-2 animate-pulse" />
            <span className="text-white text-3xl font-extrabold animate-pulse">Denegado</span>
          </div>
        )}



        {!isMyPet && (
          <div
            className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <FontAwesomeIcon icon={faHeart as IconProp} className={`${isLiked ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
        )}

        <h1
          className="absolute bottom-0 right-2 text-white font-semibold text-2xl z-10"
          style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}
        >
          {nombre}
        </h1>
      </header>

      <footer
        className="flex flex-col h-1/4 text-black py-4 items-center justify-center w-full relative font-montserrat font-semibold rounded-b-lg"
        style={{ backgroundColor: footerBg }}
      >
        <div className="flex items-center space-x-2 z-10">
          <p>
            {anios === 0
              ? `${meses} ${meses === 1 ? 'mes' : 'meses'}`
              : anios === 1
                ? `1 año, ${meses} ${meses === 1 ? 'mes' : 'meses'}`
                : `${anios} años`}
          </p>
        </div>
        <div className="flex items-center space-x-2 z-10">
          <FontAwesomeIcon icon={faMapMarkerAlt as IconProp} />
          <p className="text-black-800 text-sm font-light">{ciudad}</p>
        </div>

        <svg
          width="70"
          height="70"
          viewBox="0 0 82 116"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 bottom-0 transform z-0"
          style={{ maxWidth: '100%', maxHeight: '100%', fill: svgBg }}
        >
          <path d="M66.3484 83.4388C56.2913 85.3644 46.8156 80.0166 45.1838 71.4942C43.5521 62.9718 50.3822 54.502 60.4393 52.5764C70.4965 50.6508 79.9722 55.9986 81.6039 64.521C83.2357 73.0435 76.4055 81.5132 66.3484 83.4388Z" />
          <path d="M58.7324 47.8435C49.5678 52.4114 39.0006 49.8187 35.1299 42.0527C31.2591 34.2867 35.5505 24.2881 44.715 19.7203C53.8796 15.1524 64.4468 17.7451 68.3176 25.5111C72.1883 33.2771 67.8969 43.2757 58.7324 47.8435Z" />
          <path d="M30.005 22.0778C25.5142 28.998 17.1197 31.523 11.2555 27.7175C5.39129 23.912 4.27793 15.217 8.76875 8.29677C13.2596 1.37652 21.654 -1.14846 27.5182 2.65706C33.3824 6.46258 34.4958 15.1575 30.005 22.0778Z" />
          <path d="M50.9846 115.148C42.4635 115.313 35.4425 109.593 35.3026 102.372C35.1627 95.1513 41.957 89.1639 50.4781 88.9989C58.9992 88.8338 66.0202 94.5536 66.1601 101.774C66.3 108.995 59.5057 114.983 50.9846 115.148Z" />
          <path d="M23.0099 104.61C9.26048 120.154 -18.9528 113.399 -29.4054 97.3449C-39.858 81.2904 -34.2644 53.0729 -14.8423 46.4718C7.13988 40.5404 27.1205 37.6826 37.5731 53.7371C48.0257 69.7915 39.4475 86.0272 23.0099 104.61Z" />
        </svg>
      </footer>
    </div>
  );
};

export default PetCard;
