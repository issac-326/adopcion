'use client';

import React, { useState, useEffect } from 'react';
import { getMascotaEspecifica } from '@/app/menu/mascota/[id]/actions';
import { verificacionFavoritos, favorito } from '@/app/menu/favoritos/actions';
import Image from 'next/image';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faLocationDot, faPaw } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import PetInformationSkeleton from '@/components/ui/PetInformationSkeleton';
import { faCircleCheck, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { Button } from "@/components/ui/button";
import { deleteMascota, markAsAdopted } from '@/app/menu/perfil/mascotas/[id]/actions';
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';
import Chat from '@/components/Chat';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function PetInformation({ id, id_usuario, isMyPet = false, isInicio = true }: { id: string, id_usuario: string, isMyPet?: boolean, isInicio?: boolean }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  interface Mascota {
    nombre: string;
    anios: number;
    meses: number;
    color: string;
    peso: number;
    vacunas: boolean | null;
    condicion_medica: string | null;
    imagen: string;
    ciudad: string;
    sexo: boolean;
    descripcion: string;
    departamentos: { descripcion: string }[];
    usuarios: { id_usuario: string; nombre1: string; imagen: string };
    categorias: { tipo_mascotas: string }[];
    estado_adopcion: boolean;
    visible: boolean;
  }

  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdopted, setIsAdopted] = useState(false);
  const router = useRouter();
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };
  console.log(id_usuario);
  console.log('isInicio:', isInicio);

  function fire(particleRatio: number, opts: object) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  const handleConfetti = () => {
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

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

  const handleOption = async () => {
    if (!isAdopted) {
      try {
        await deleteMascota(Number(id));
        toast.success('Mascota eliminada exitosamente');
        router.push('/menu/perfil?misMascotas=true');
      } catch (error) {
        console.error('Error al eliminar mascota:', error);
      }

      return;
    }

    try {
      await markAsAdopted(Number(id));
      toast.success(
        <p>
          ¡Felicidades, has encontrado un nuevo hogar para{' '}
          <span className='font-medium'>{mascota?.nombre}</span>! 🎉
        </p>,
        {
          autoClose: 5000,
        }
      );

      handleConfetti();
      setIsModalOpen(false);
      setMascota(mascota ? { ...mascota, estado_adopcion: false } : null);

    } catch (error) {
      console.error('Error al marcar mascota como adoptada:', error);
    }
    handleConfetti();
  }

  console.log('mascota', mascota)
  if (!mascota) return <PetInformationSkeleton isMyPet={true} />;

  console.log(mascota)

  return (
    isChatOpen ? 
    <>
      <Chat receiverUID={String(mascota.usuarios.id_usuario)} mascota={mascota.nombre} onRetroceder={setIsChatOpen}/>
    </> :
      <div className="bg-white min-h-screen flex flex-col lg:flex-row-reverse p-5">
        {/* Imagen de la mascota */}
        <div className="flex-1 flex justify-center items-center rounded-br-[50px] mt-8 lg:mt-0">
          <Image
            src={mascota.imagen}
            alt="Mascota"
            width={300} // Tamaño deseado
            height={300} // Tamaño deseado
            className="shadow-[0_0px_15px_rgba(0,0,0,0.8)] rounded-lg object-cover sm:w-[200px] sm:h-[200px] lg:w-[500px] lg:h-[500px]"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Información */}
        <div className="flex-1 flex flex-col justify-between p-8">
          {/* Botón para regresar */}
          <div className="rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center cursor-pointer hover:scale-110" onClick={() => { isInicio ? router.push('/menu/inicio') : router.push('/menu/perfil') }}>
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
                  {mascota.ciudad}, {mascota.departamentos[0]?.descripcion}
                </div>
              </div>
              {!isMyPet && (<button className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full bg-white shadow-[0_0px_7px_rgba(0,0,0,0.6)]  cursor-pointer" onClick={handleLike}>
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`text-[16px] sm:text-[20px] lg:text-[25px] ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
                />
              </button>)}

            </div>

            {/* Descripción y detalles */}
            <div className="flex flex-col lg:flex-row justify-between mt-8">
              <div className="flex-1 bg-green-200 p-3 rounded-lg relative transition-transform mr-4 mb-4 lg:mb-0">
                <h2 className="font-bold">{mascota.sexo ? "Macho" : "Hembra"}</h2>
                <p className="text-xs text-gray-500">Sexo</p>
                <FontAwesomeIcon icon={faPaw} className="absolute top-5 right-4 text-green-500 opacity-30 rotate-[-30deg] text-[30px] sm:text-[40px]" />
              </div>
              <div className="flex-1 bg-orange-200 p-3 rounded-lg relative hover:scale-110 transition-transform mr-4 mb-4 lg:mb-0">
                <h2 className="font-bold">
                  {mascota.anios === 0
                    ? `${mascota.meses} ${mascota.meses === 1 ? 'mes' : 'meses'}` // Solo meses si los años son 0
                    : `${mascota.anios} ${mascota.anios === 1 ? 'año' : 'años'}`}
                </h2>
                <p className="text-xs text-gray-500">Edad</p>
                <FontAwesomeIcon icon={faPaw} className="absolute top-5 right-4 text-orange-500 opacity-30 rotate-[-30deg] text-[30px] sm:text-[40px]" />
              </div>
              <div className="flex-1 bg-blue-200 p-3 rounded-lg relative transition-transform">
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
              <div><span className="font-semibold">Especie:</span> {mascota.categorias[0]?.tipo_mascotas || 'Indefinido'}</div>
              <div className="text-base mt-4"><span className="font-semibold">Descripción:</span> {mascota.descripcion || 'Indefinido'}</div>
            </div>

            {/* Dueño */}
            {!isMyPet && (
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
            )}

            {/* Botón de Adoptar */}
            {!isMyPet && mascota.estado_adopcion && (
              <div>
                <button
                  className="w-full sm:w-full lg:w-3/5 py-2 sm:py-3 bg-orange-300 text-white rounded-3xl text-sm sm:text-lg transition-colors mx-auto block"
                  onClick={() => setIsChatOpen(true)}
                >
                  Adoptar
                </button>
              </div>
            )}

            {isMyPet && mascota.estado_adopcion && (<div className='flex flex-col sm:flex-row justify-around items-center gap-4 py-4'>
              <div
                className='flex flex-1 justify-center items-center py-2 px-4 gap-2 rounded-lg bg-[#f8c96e] text-[#00] hover:text-white transition-colors cursor-pointer hover:scale-105 transition-scale'
                onClick={() => router.push(`/menu/perfil/mascotas/${id}/editar`)}
              >
                <div>Editar</div>
                <FontAwesomeIcon icon={faPenToSquare} />
              </div>

              <div
                className='flex flex-1 justify-center items-center py-2 px-4 gap-2 rounded-lg bg-[#f5a2a4] text-[#000] hover:text-white transition-colors cursor-pointer hover:scale-105 transition-scale'
                onClick={() => { setIsModalOpen(true); setIsAdopted(false) }}
              >
                <div>Quitar</div>
                <FontAwesomeIcon icon={faTrashCan} />
              </div>

              <div
                className='flex flex-1 justify-center items-center py-2 px-4 gap-2 rounded-lg bg-[#84f384] text-[#000] hover:text-white transition-colors cursor-pointer hover:scale-105 transition-scale'
                onClick={() => { setIsModalOpen(true); setIsAdopted(true) }}
              >
                <div>Adoptado</div>
                <FontAwesomeIcon icon={faCircleCheck} />
              </div>
            </div>)}

            {isMyPet && !mascota.estado_adopcion && (<div
              className='flex flex-1 justify-center items-center max-h-16 py-2 px-4 gap-2 rounded-lg bg-[#f5a2a4] text-[#000] hover:bg-[#DA627D] hover:text-white transition-colors cursor-pointer hover:scale-105 transition-scale'
              onClick={() => { setIsModalOpen(true); setIsAdopted(false) }}
            >
              <div>Quitar</div>
              <FontAwesomeIcon icon={faTrashCan} />
            </div>)}


          </div>


        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isAdopted ? '¡Felicidades, Mascota Adoptada!' : '¿Estás seguro de que quieres decir adiós?'}
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              {isAdopted
                ? 'Al marcar esta mascota como adoptada, ya no estará visible para los demás amantes de las mascotas. ¡Buen trabajo!'
                : 'Si eliminas esta mascota, no podrá ser vista por otros posibles adoptantes. ¿Seguro que quieres hacerlo?'}
            </div>

            <DialogFooter>
              <Button
                onClick={handleOption}
                className={`w-full ${isAdopted ? 'bg-green-500' : 'bg-red-500'} hover:bg-blue`}
              >
                {isAdopted ? '¡Marcar como adoptada!' : '¡Eliminar, adiós!'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      </div>
  );
}
