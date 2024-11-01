'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { getMyPets, getUserProfile, updateUserProfile } from './actions';
import PetList from "@/components/ui/PetList";
import PetCardSkeleton from "@/components/ui/petCardSkeleton";
import Image from "next/image";

const ProfilePage = () => {

    const userId = localStorage.getItem('userId');

    const router = useRouter();

    const [myPets, setMyPets] = useState([]);
    const [loadingPets, setLoadingPets] = useState(false);

    //trae las mascotas de este usuario
    useEffect(() => {
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

        fetchPets();
    }, [userId]);


    return (
        <>
        <div className="rounded-full w-200 h-200 flex justify-center items-center mt-10 gap-10">
            <Image src="/perfil.png" alt="profile" width={170} height={170} />
            <div>
                <h1>
                    Kenneth Contreras
                </h1>
                <p>
                    Tegucigalpa, Honduras
                </p>
            </div>

        </div>

            {loadingPets ?
                <PetCardSkeleton /> :
                <div>
                    <h2 className="text-texto mt-5 font-montserrat text-xl font-medium">Mis Mascotas</h2>
                    <hr className='border-1 boder-white' />
                    {myPets.length === 0 ? (<p>No ha publicado mascotas</p>) : <PetList pets={myPets} areMyPets={true} />
                    }
                </div>
            }


        </>
    );
};

export default ProfilePage;