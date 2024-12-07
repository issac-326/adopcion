import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPaw } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { getMascotaEspecifica } from "@/app/menu/mascota/[id]/actions";
import Link from 'next/link';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    onReject: () => void;
    id: number; // Debe ser un número
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onAccept, onReject, id }) => {
    if (!isOpen) return null;

    interface Mascota {
        nombre: string;
        anios: number;
        meses: number;
        color: string;
        peso: number;
        imagen: string;
        ciudad: string;
        sexo: boolean;
        descripcion: string;
        departamentos: { descripcion: string };
        usuarios: { id_usuario: string; nombre1: string; imagen: string };
        categorias: { tipo_mascotas: string };

    }

    const [mascota, setMascota] = useState<Mascota | null>(null);
    useEffect(() => {
        const fetchMascota = async () => {
            try {
                const data = await getMascotaEspecifica(Number(id));
                //@ts-expect-error
                setMascota(data);
            } catch (error) {
                console.error('Error al cargar la mascota:', error);
            }
        };

        fetchMascota();
    }, [id]);

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white w-[90%] h-[95%] p-6 rounded-lg shadow-lg overflow-y-auto">
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Imagen de la mascota */}
                        <div className="flex-1 flex justify-center items-center rounded-br-[50px] mt-8 lg:mt-0">
                            <Image
                                src={mascota?.imagen || '/Perro-2.png'}
                                alt="Mascota"
                                width={300} // Tamaño deseado
                                height={300} // Tamaño deseado
                                className="shadow-[0_0px_15px_rgba(0,0,0,0.8)] rounded-lg object-cover sm:w-[200px] sm:h-[200px] lg:w-[500px] lg:h-[500px]"
                                style={{ objectFit: 'cover' }}
                            />

                        </div>

                        {/* Información */}
                        <div className="flex-1 flex flex-col justify-between p-8">
                            <div className="flex-1 p-8 pt-2 flex flex-col">
                                {/* Nombre y ubicación */}
                                <div className="flex justify-between items-center">
                                    <div className="p-2">
                                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{mascota?.nombre} </h1>
                                        <div className="text-gray-500 flex items-center">
                                            <FontAwesomeIcon icon={faLocationDot as IconProp} className="text-blue-500 mr-2 sm:text-sm" />
                                            {mascota?.departamentos.descripcion}
                                        </div>
                                    </div>
                                </div>

                                {/* Descripción y detalles */}
                                <div className="flex flex-col lg:flex-row justify-between mt-5">
                                    <div className="flex-1 bg-green-200 p-3 rounded-lg relative transition-transform mr-4 mb-4 lg:mb-0">
                                        <h2 className="font-bold">{mascota?.sexo ? "Macho" : "Hembra"}</h2>
                                        <p className="text-xs text-gray-500">Sexo</p>
                                        <FontAwesomeIcon icon={faPaw as IconProp} className="absolute top-5 right-4 text-green-500 opacity-30 rotate-[-30deg] text-[30px] sm:text-[40px]" />
                                    </div>
                                    <div className="flex-1 bg-orange-200 p-3 rounded-lg relative hover:scale-110 transition-transform mr-4 mb-4 lg:mb-0">
                                        <h2 className="font-bold">
                                            {mascota?.anios === 0
                                                ? `${mascota.meses} ${mascota.meses === 1 ? 'mes' : 'meses'}` // Solo meses si los años son 0
                                                : `${mascota?.anios} ${mascota?.anios === 1 ? 'año' : 'años'}`}

                                        </h2>
                                        <p className="text-xs text-gray-500">Edad</p>
                                        <FontAwesomeIcon icon={faPaw as IconProp} className="absolute top-5 right-4 text-orange-500 opacity-30 rotate-[-30deg] text-[30px] sm:text-[40px]" />
                                    </div>
                                    <div className="flex-1 bg-blue-200 p-3 rounded-lg relative transition-transform">
                                        <h2 className="font-bold">{mascota?.peso} kg</h2>
                                        <p className="text-xs text-gray-500">Peso</p>
                                        <FontAwesomeIcon icon={faPaw as IconProp} className="absolute top-5 right-4 text-blue-500 opacity-30 rotate-[-30deg] text-[30px] sm:text-[40px]" />
                                    </div>
                                </div>

                                {/* Descripción general */}
                                <div className="mt-5 mb-8 text-sm sm:text-base">

                                    <div><span className="font-semibold">Especie:</span> {mascota?.categorias.tipo_mascotas || 'Indefinido'}</div>
                                    <div className="text-base mt-3"><span className="font-semibold">Descripción:</span> {mascota?.descripcion}</div>
                                </div>

                                {/* Dueño */}

                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        <div className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] lg:w-[60px] lg:h-[60px] overflow-hidden rounded-full">
                                            <Image
                                                src={mascota?.usuarios.imagen || '/imagen_prueba.jpg'}
                                                alt="Propietario"
                                                width={60}
                                                height={60}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-bold">{mascota?.usuarios.nombre1}</p>
                                            <p className="text-gray-500">Propietario</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">

                                <button
                                    onClick={onReject}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    <span className="hidden sm:inline ml-2 break-words text-left">Rechazar</span>
                                </button>

                                <button
                                    onClick={onAccept}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    <span className="hidden sm:inline ml-2 break-words text-left">Aceptar</span>
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Cerrar
                                </button>
                            </div>

                        </div>
                    </div>


                </div>
            </div>
        </>
    );
};

export default Modal;
