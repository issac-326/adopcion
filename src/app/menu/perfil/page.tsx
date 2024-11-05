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

const ProfilePage = () => {

    const userId = localStorage.getItem('userId');
    const [isMyPetSelected, setIsMyPetSelected] = useState(true);

    const router = useRouter();

    const [myPets, setMyPets] = useState([]);
    const [loadingPets, setLoadingPets] = useState(false);
    const [user, setUser] = useState(null);

    //trae las mascotas publicadas de este usuario
    const fetchPets = async () => {
        if (!userId) {
            return;
        }

        setLoadingPets(true);

        try {
            const pets = await getMyPets(userId);
            setMyPets(pets || []);
        } catch (error) {
            console.error("Error fetching pets:", error);
            toast.error("Error al obtener las mascotas.");
        } finally {
            setLoadingPets(false);
        }
    };

    //trae los favoritos de este usuario
    const obtenerFavoritosUsuario = async () => {
        const userId = localStorage.getItem('userId'); // Obtener el userId de localStorage
        if (!userId) {
            console.error("No se encontró el userId en localStorage.");
            return;
        }

        try {
            setLoadingPets(true);
            const data = await getFavoritos(parseInt(userId)); // Convertir a número si es necesario
            setMyPets(data ?? []);
        } catch (error) {
            console.error("Error al obtener favoritos:", error);
        } finally {
            setLoadingPets(false);
        }
    };

    const obtenerUserProfile = async () => {
        try {
            const usuario = await getUserProfile(userId);
            setUser(usuario);
        } catch (error) {
            console.error("Error al obtener el perfil del usuario:", error);
        }
    }

    //trae las mascotas de este usuario
    useEffect(() => {
        fetchPets();
        obtenerUserProfile();


    }, [userId]);

    useEffect(() => {
        if (isMyPetSelected) {
            fetchPets();
        } else {
            obtenerFavoritosUsuario();
        }
    }, [isMyPetSelected]);

    return (
        <>
            <div
                className="relative w-200 h-200 flex rounded-t-xl justify-between items-center mt-6 gap-10 moving-gradient"
            >
                <div className="flex items-center">

                    <Image src={user?.imagen} alt="profile" width={170} height={170} />
                    <div>
                        <h1 className="text-lg font-semibold">
                            {user?.nombre1} {user?.apellido1}
                        </h1>
                        <p className="text-sm text-gray-600 font-medium">
                            Tegucigalpa, Honduras
                        </p>
                    </div>
                </div>
                <div className="flex justify-center items-center gap-2 rounded-full absolute bottom-2 right-2 hover:cursor-pointer hover:scale-105 bg-white text-xs py-1 px-2" onClick={() => router.push('/menu/configuraciones/perfil')}>
                    <span>                    editar
                    </span>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </div>
            </div>



            <section className="flex justify-center gap-14 border-t-1 text-xs text-gray-600 font-medium">
                <div className={`box-border flex items-center gap-2 py-4 hover:cursor-pointer ${isMyPetSelected ? 'border-t border-orange-400 text-black' : ''
                    }`} onClick={() => setIsMyPetSelected(true)}>
                    <FontAwesomeIcon icon={faShieldCat} />
                    <h2>MIS MASCOTAS</h2>
                </div>
                <div className={`flex items-center gap-2 py-4 hover:cursor-pointer ${!isMyPetSelected ? 'border-t border-orange-400 font-semibold text-black' : ''
                    }`} onClick={() => setIsMyPetSelected(false)}>
                    <FontAwesomeIcon icon={faHeart} />
                    <h2>FAVORITOS</h2>
                </div>

            </section>

            {loadingPets ?
                <PetCardSkeleton /> :
                <div >

                    {myPets.length === 0 ? (<p>No hay mascotas por mostar 😿</p>) : <PetList pets={myPets} areMyPets={isMyPetSelected} isInicio={false} />
                    }
                </div>
            }
        </>

    );
}

export default ProfilePage;

