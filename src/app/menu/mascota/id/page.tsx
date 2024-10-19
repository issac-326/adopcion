'use client';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faAngleLeft, faLocationDot, faPaw } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

const Mascotas = () => {
  return (
    <div className="flex p-5 h-screen">
      {/* Información */}
      <div className="flex-1 p-8 flex flex-col justify-between bg-white rounded-tr-[50px] rounded-br-[50px] shadow-[0px_5px_20px_rgba(0,0,0,0.4)]">
        {/* Botón para regresar */}
        <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,0.4)] cursor-pointer hover:scale-110">
          <button>
            <FontAwesomeIcon icon={faAngleLeft} className="text-red-500 text-[25px]" />
          </button>
        </div>

        <div className="flex-1 p-8 flex flex-col">
          {/* Nombre y ubicación */}
          <div className="flex justify-between items-center">
            <div className="p-5">
              <h1 className="text-3xl font-bold mb-2">Doggi</h1>
              <div className="text-gray-500 flex items-center">
                <FontAwesomeIcon icon={faLocationDot} className="text-blue-500 mr-2" />
                TGU, HN
              </div>
            </div>
            <button className="w-14 h-14 rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.4)] cursor-pointer">
              <FontAwesomeIcon icon={faHeart} className="text-red-500 text-[25px]" />
            </button>
          </div>

          {/* Descripción y detalles */}
          <div className="flex justify-between mt-8">
            <div className="flex-1 bg-green-200 p-3 rounded-lg relative hover:scale-110 transition-transform mr-4">
              <h2 className="font-bold">Macho</h2>
              <p className="text-xs text-gray-500">Sexo</p>
              <FontAwesomeIcon
                icon={faPaw}
                className="absolute top-5 right-4 text-green-500 opacity-30 rotate-[-30deg] text-[40px]"
              />
            </div>
            <div className="flex-1 bg-orange-200 p-3 rounded-lg relative hover:scale-110 transition-transform mr-4">
              <h2 className="font-bold">1 año</h2>
              <p className="text-xs text-gray-500">Edad</p>
              <FontAwesomeIcon
                icon={faPaw}
                className="absolute top-5 right-4 text-orange-500 opacity-30 rotate-[-30deg] text-[40px]"
              />
            </div>
            <div className="flex-1 bg-blue-200 p-3 rounded-lg relative hover:scale-110 transition-transform">
              <h2 className="font-bold">10kg</h2>
              <p className="text-xs text-gray-500">Peso</p>
              <FontAwesomeIcon
                icon={faPaw}
                className="absolute top-5 right-4 text-blue-500 opacity-30 rotate-[-30deg] text-[40px]"
              />
            </div>
          </div>

          <div className="mt-12 mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, atque expedita? Quam nemo voluptatibus beatae.
          </div>

          {/* Imagen y nombre del dueño */}
          <div className="flex items-center mb-6">
            <Image src="/Leo.webp" alt="Propietario" width={70} height={70} className="rounded-full" />
            <div className="ml-4">
              <p className="font-bold">Sophia</p>
            </div>
          </div>
        </div>

        {/* Botón de Adoptar */}
        <div>
          <button className="w-full py-3 bg-orange-300 text-white rounded-3xl text-lg hover:bg-orange-400 transition-colors">
            Adoptar
          </button>
        </div>
      </div>

      {/* Lado derecho Imagen de la mascota */}
      <div className="flex-1 flex justify-center items-center rounded-br-[50px]">
        <Image
          src="/misty.avif"
          alt="Mascota"
          width={500}
          height={500}
          className="shadow-[5px_5px_15px_rgba(0,0,0,0.9)] rounded-lg"
        />
      </div>
    </div>
  );
};

export default Mascotas;
