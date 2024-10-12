'use client'

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface InputProps {
  nombre: string;
  ciudad: string;
  imagen: string;
}

const PetCard: React.FC<InputProps> = ({
  
}) => {

  const router = useRouter();

  return (
    <section className="bg-[#ADD8E6] h-[200px] rounded-[10px_10px_10px_10px_/_15px_15px_15px_15px]" onClick={() => router.push('mascotas/6')}>
      <div className="flex flex-col space-y-1.5 pt-4 pl-4 pr-4">
        <div className="grid grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold leading-none tracking-tight text-[#03063A]">
              Leo
            </h3>
            <p className="text-xs text-muted-foreground">Tegucigalpa, Honduras</p>
          </div>
          <div className="flex justify-end">
            <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#BB271A"
              >
                <path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Image src="/Leo.webp" alt="Mascota" width={190} height={200} />
      </div>
    </section>
  );
};

export default PetCard;
