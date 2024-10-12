'use client'
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";

  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import {faMagnifyingGlass, faChevronDown, faSliders, faGear, faChevronRight} from '@fortawesome/free-solid-svg-icons'
  import {faBell, faUser, faHeart, faCommentDots, } from '@fortawesome/free-regular-svg-icons'
import { getCategorias, getCategoriaEspecifica } from "@/app/menu/home/actions";  

interface Categoria {
    id_categoria: number;
    tipo_mascotas: string;
}

export default function MenuCategorias() {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    // Define el tipo como string o null
    const [categories, setCategories] = useState<Categoria[]>([]); // Usa useState para manejar las categorías

    const [loading, setLoading] = useState<boolean>(true); // Estado para cargar
    const obtenerCategorias = async () => {
        try {
            const data = await getCategorias(); // obtengo el array con su tipo e id
            setCategories(data); // Guardo las categories
            setLoading(false); // Cambio el estado de carga
        } catch (error) {
            console.error("Error al obtener las categorías en el frontend:", error);
        }
        console.log(categories);
    };

    useEffect(() => {
        obtenerCategorias(); // Llama a la función al montar el componente
    }, []);
    
    const seleccionarCategoria = async (id: number) => {
        try {
            const data = await getCategoriaEspecifica(id); // obtengo el array con su tipo e id
            console.log(data);
        } catch (error) {
            console.error("Error al obtener las categorías en el frontend:", error);
        }
    };

    return (
      <div className="mx-2 text-[#03063a]">

        <div id="encabezado" className="mt-10 mb-2 flex justify-between text-[#03063a]">
            <div>  
                <div className="flex gap-2 text-sm text-gray-400">Location <FontAwesomeIcon icon={faChevronDown} className="w-3"/></div>  
                <div><span className="font-extrabold">TGU,</span> HN</div>        
            </div>
            <div className="flex gap-2">
                <span className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#f7f7f8]"><FontAwesomeIcon icon={faMagnifyingGlass} className="w-6" /></span>

                <span className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#f7f7f8]"><FontAwesomeIcon icon={faBell} className="w-6"/></span>
            </div>
        </div>


        <div className="flex justify-center">
            <div id="imagen" className="h-[166px] w-[380px] bg-[#FE8A5B] rounded-[20px] grid grid-cols-2">
                <div className=" bg-[#FE8A5B] rounded-l-[20px] ">
                    <div className="mt-5 ml-5">
                        <p className="text-base text-white">Join Our Animal</p>
                        <p className="text-base text-white">Lovers Community</p>
                    </div>
                    <Button asChild className="mt-5 ml-5">
                        <Link href="/error">Join now</Link>
                    </Button>

                </div>
                <div className="bg-[#FE8A5B] flex flex-col-reverse rounded-r-[20px] ">
                    <Image  src="/promo.png" alt="promo" width={200} height={200} />
                </div>
            </div>
        </div>
        <div className="mt-5">
            <h2 className="text-texto my-3 font-semibold">Categories</h2>
            <section className="flex justify-between">
                <Button
                    className={`h-14 w-14 rounded-xl flex items-center justify-center hover:bg-[#FE8A5B] hover:text-white  ${selectedCategory === null ? 'bg-[#FE8A5B] text-white' : 'bg-[#f7f7f8] text-black'}`}
                    onClick={() => {
                        setSelectedCategory(null); // Cambia el estado de la categoría seleccionada
                        seleccionarCategoria(0); // Llama a la función para seleccionar la categoría
                    }}// Esto solo cambiará su estilo
                >
                    All
                </Button>
                {loading ? <div>Loading...</div> : categories.map((category, index) => (
                    <Button
                        key={index}
                        className={`h-14 w-14 rounded-xl flex items-center justify-center hover:bg-[#FE8A5B] hover:text-white ${selectedCategory === index ? 'bg-[#FE8A5B] text-white' : 'bg-[#f7f7f8] text-black'}`}
                        onClick={() => {
                            setSelectedCategory(index); // Cambia el estado de la categoría seleccionada
                            seleccionarCategoria(category.id_categoria); // Llama a la función para seleccionar la categoría
                        }}
                    >
                        {category.tipo_mascotas}
                    </Button>
                ))}
            </section>


        </div>
        <section className="mt-5 flex justify-between items-center">
            <h2 className="font-semibold">Adopt pet</h2>
            <div className="text-[#FE8A5B] flex gap-2">
                <div className="flex text-xs">View All</div>
                <div className="bg-[#FE8A5B] w-4 h-4 rounded-sm flex items-center justify-center">
                    <FontAwesomeIcon icon={faChevronRight} className="w-1 text-white" />
                </div>
            </div>
        </section>
       </div>
    );
  }
  