'use client'

import * as React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface InputProps { // Propiedades que recibe el componente
  id: number; // Debe ser un número
  nombre: string;
  edad: number;
  ciudad: string;
  imagen: string;
  footerBg: string;
  svgBg: string;
}

const PetCard= ({
  nombre,
  ciudad,
  imagen,
  id,
  edad,
  footerBg,
  svgBg,
}: InputProps) => {

  const router = useRouter();

  return (
<div
  className="flex flex-col cursor-pointer hover:scale-102 transition-transform duration-300 relative border w-full h-68 rounded-lg shadow-lg overflow-hidden" // Añadir overflow-hidden
  key={id}
  onClick={() => router.push(`/mascotas/${id}`)}
>
<header className="relative h-4/5 overflow-hidden">
  <Image 
    src={imagen} 
    alt="perro" 
    className="w-full h-full object-cover" 
    width={50} 
    height={50}
    style={{ objectFit: 'cover' }}
  />
  <div className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center hover:scale-110">
    <FontAwesomeIcon icon={faHeart} className="text-red-500" />
  </div>
  <h1
    className="absolute bottom-0 right-2 text-white font-semibold text-2xl z-10"
    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}
  >
    {nombre}
  </h1>
</header>


  <footer
    className="flex flex-col h-1/4 text-black py-4 items-center justify-center w-full relative font-montserrat font-semibold rounded-b-lg" // Añadir rounded-b-lg
    style={{ backgroundColor: footerBg }} // Aplica el color de fondo dinámico
  >
    <div className="flex items-center space-x-2 z-10">
      <p>{edad} años</p>
    </div>
    <div className="flex items-center space-x-2 z-10">
      <FontAwesomeIcon icon={faMapMarkerAlt} />
      <p className='text-black-800 text-sm font-light'>{ciudad}, HN</p>
    </div>

    <svg
      width="70"
      height="70"
      viewBox="0 0 82 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-0 bottom-0 transform z-0"
      style={{ maxWidth: '100%', maxHeight: '100%', fill: svgBg }} // Aplica el color SVG dinámico
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
