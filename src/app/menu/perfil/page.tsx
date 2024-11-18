'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { getMyPets, getFavoritos, getUserProfile } from './actions';
import PetList from "@/components/ui/PetList";
import PetCardSkeleton from "@/components/ui/petCardSkeleton";
import Image from "next/image";
import { faShieldCat, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Definir los tipos de usuario y mascota
interface UserProfile {
    nombre1: string;
    apellido1: string;
    imagen: string;
}

interface Pet {
    id_publicacion: number;
    nombre: string;
    anios: number;
    meses: number;
    ciudad: string;
    estado_adopcion: boolean;
    imagen: string;
    departamentos: { descripcion: string } | null;
}

const ProfilePage = () => {
    const [isMyPetSelected, setIsMyPetSelected] = useState(true);
    const [loadingUser, setLoadingUser] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [myPets, setMyPets] = useState<Pet[]>([]);
    const [loadingPets, setLoadingPets] = useState(false);

    const router = useRouter();

    /**
     * Obtiene y establece el perfil del usuario autenticado.
     */
    const obtenerUserProfile = async () => {
        setLoadingUser(true);
        try {
            const usuario = await getUserProfile();
            setUser(usuario as UserProfile);
        } catch (error) {
            console.error("Error al obtener el perfil del usuario:", error);
        } finally {
            setLoadingUser(false);
        }
    };

    /**
     * Obtiene y establece las mascotas publicadas por el usuario autenticado.
     */
    const fetchPets = async () => {
        setLoadingPets(true);
        try {
            const pets = await getMyPets();
            const formattedPets = pets.map((pet) => ({
                ...pet,
                departamentos: pet.departamentos ? { descripcion: String(pet.departamentos.descripcion) } : null,
            })) as Pet[];
            setMyPets(formattedPets);
        } catch (error) {
            console.error("Error al obtener mascotas:", error);
            toast.error("Error al obtener las mascotas.");
        } finally {
            setLoadingPets(false);
        }
    };

    /**
     * Obtiene y establece las publicaciones favoritas del usuario autenticado.
     */
    const obtenerFavoritosUsuario = async () => {
        setLoadingPets(true);
        try {
            const favoritos = await getFavoritos();
            const formattedFavoritos = favoritos.map((favorito) => ({
                ...favorito,
                departamentos: favorito.departamentos ? { descripcion: String(favorito.departamentos.descripcion) } : null,
            })) as Pet[];
            setMyPets(formattedFavoritos);
        } catch (error) {
            console.error("Error al obtener favoritos:", error);
        } finally {
            setLoadingPets(false);
        }
    };

    useEffect(() => {
        obtenerUserProfile();
        fetchPets();
    }, []);

    useEffect(() => {
        if (isMyPetSelected) {
            fetchPets();
        } else {
            obtenerFavoritosUsuario();
        }
    }, [isMyPetSelected]);

    return (
        <div className='mx-4 my-4' >
            {/* Sección de encabezado del perfil */}
            <div className="relative w-full h-min-300 flex rounded-t-xl justify-between items-center gap-10 moving-gradient">
                {loadingUser ? (
                    <div className="flex items-center px-6 my-8">
                        <div className="rounded-full w-36 h-36 overflow-hidden bg-gray-300 animate-pulse"></div>
                        <div className="ml-6">
                            <div className="h-6 w-48 bg-gray-300 animate-pulse mb-2"></div>
                            <div className="h-4 w-32 bg-gray-300 animate-pulse"></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center px-6 my-8">
                        <div className="relative group">
                            <Image
                                src={user?.imagen || '/default-image.png'}
                                alt="Imagen de perfil"
                                width={120}
                                height={120}
                                className="h-36 w-36 mt-2 mx-auto rounded-full aspect-square object-cover border-4 border-[#FFA07A]/50"
                            />
                        </div>
                        <div className="ml-6">
                            <h1 className="text-2xl font-semibold text-gray-1000">
                                {user?.nombre1} {user?.apellido1}
                            </h1>
                            <p className="text-sm text-gray-700 font-medium">
                                Tegucigalpa, Honduras
                            </p>
                        </div>
                    </div>
                )}

                <div
                    className="flex items-center gap-2 rounded-full absolute bottom-2 right-2 hover:cursor-pointer bg-white text-xs py-1 px-2 w-8 h-8 hover:w-20 transition-all duration-300 ease-in-out overflow-hidden"
                    onClick={() => router.push('/menu/configuraciones/perfil')}
                >
                    <FontAwesomeIcon icon={faPenToSquare} className="text-base" />
                    <span className="text-black transition-opacity duration-300 ease-in-out whitespace-nowrap">
                        editar
                    </span>
                </div>
            </div>

            <style jsx>{`
                .moving-gradient {
                    background: linear-gradient(270deg, #fcbad3, #a3d8f4, #fce38a, #b5e7a0, #f8a978);
                    background-size: 1000% 1000%;
                    animation: gradientAnimation 20s ease infinite;
                }

                @keyframes gradientAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            <section className="flex justify-center gap-14 border-t-1 text-xs text-gray-600 font-medium">
                <div
                    className={`box-border flex items-center gap-2 py-4 hover:cursor-pointer ${isMyPetSelected ? 'border-t border-orange-400 text-black' : ''}`}
                    onClick={() => setIsMyPetSelected(true)}
                >
                    <FontAwesomeIcon icon={faShieldCat} />
                    <h2>MIS MASCOTAS</h2>
                </div>
                <div
                    className={`flex items-center gap-2 py-4 hover:cursor-pointer ${!isMyPetSelected ? 'border-t border-orange-400 font-semibold text-black' : ''}`}
                    onClick={() => setIsMyPetSelected(false)}
                >
                    <FontAwesomeIcon icon={faHeart} />
                    <h2>FAVORITOS</h2>
                </div>
            </section>

            {loadingPets ? (
                <PetCardSkeleton />
            ) : (
                <div>
                    {myPets.length === 0 ? (
                        <p>No hay mascotas por mostrar 😿</p>
                    ) : (
                        <PetList pets={myPets} areMyPets={isMyPetSelected} isInicio={false} onDislike={obtenerFavoritosUsuario} isLikedP={true} />
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
