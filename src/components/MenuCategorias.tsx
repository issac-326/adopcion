'use client';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { faMagnifyingGlass, faChevronDown, faBell, faChevronRight, faDog, faCat, faDove, faFish } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCategorias, getCategoriaEspecifica } from "@/app/menu/home/actions";  
import Pet from "@/types/Pet";

/* todas las interfaces son por el tipado de typescript */
interface Categoria {
    id_categoria: number;
    tipo_mascotas: string;
}

interface MenuCategoriasProps {
    escogerMascotas: (mascotas: Pet[]) => void;
}

export default function MenuCategorias({ escogerMascotas }: MenuCategoriasProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedMascotas, setSelectedMascotas] = useState<Pet[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const bannerImages = [
        '/adopta.png',
        '/denuncia-animal.png',
        '/publica-mascota.png',
        '/navega-filtros.png'
    ];

    type MascotaTipo = 'cat' | 'dog' | 'dove' | 'fish';

    /* para hacer dinamico los iconos de font awesome */
    const iconMapping: Record<MascotaTipo, any> = {
        cat: faCat,
        dog: faDog,
        dove: faDove,
        fish: faFish
    };

    /* obtiene las categorias y las carga en el estado nomas cargar la pagina*/
    useEffect(() => {
        const obtenerCategorias = async () => {
            try {
                const data = await getCategorias();
                setCategories(data);
            } catch (error) {
                console.error("Error al obtener las categorías en el frontend:", error);
            } finally {
                setLoading(false);
            }
        };

        obtenerCategorias();
        seleccionarMascotasPorId(0);
    }, []);

    const seleccionarMascotasPorId = async (id: number) => {
        try {
            const data = await getCategoriaEspecifica(id);
            setSelectedMascotas(data ?? []);
        } catch (error) {
            console.error("Error al obtener la categoría específica:", error);
        }
    };

    const getButtonClasses = (isSelected: boolean) => {
        return isSelected ? 'bg-[#FE8A5B] text-white' : 'bg-[#f7f7f8] text-black';
    };

    /* se ejecuta cada vez que selecciona mascotas asi hacemos que renderice con las nuevas mascotas */
    useEffect(() => {
        escogerMascotas(selectedMascotas);
    }, [selectedMascotas]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bannerImages.length]);

    return (
        <div className="text-[#03063a] m-2 bg-white">
            <div id="encabezado" className="mt-8 mb-2 flex justify-between text-[#03063a]">
                <div>  
                    <div className="flex gap-2 text-sm text-gray-400">Location <FontAwesomeIcon icon={faChevronDown} className="w-3"/></div>  
                    <div><span className="font-extrabold">TGU,</span> HN</div>        
                </div>
                <div className="flex gap-2">
                    <span className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#f7f7f8]"><FontAwesomeIcon icon={faMagnifyingGlass} className="w-6" /></span>
                    <span className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#f7f7f8]"><FontAwesomeIcon icon={faBell} className="w-6"/></span>
                </div>
            </div>

            <section className="grid grid-cols-5 gap-2 h-56">
                <div id="default-carousel" className="relative w-full col-span-4">
                    <div className="relative h-full overflow-hidden rounded-lg">
                        {bannerImages.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
                                data-carousel-item
                            >
                                <img
                                    src={image}
                                    className="absolute block w-full h-full object-cover"
                                    alt={`Banner ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Botones de navegación */}
                    <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                        {bannerImages.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-400"}`}
                                aria-current={index === currentIndex ? "true" : "false"}
                                aria-label={`Slide ${index + 1}`}
                                onClick={() => setCurrentIndex(index)}
                            ></button>
                        ))}
                    </div>

                    {/* Botón anterior */}
                    <button
                        type="button"
                        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                        onClick={() => setCurrentIndex((currentIndex - 1 + bannerImages.length) % bannerImages.length)}
                    >
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
                            <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                            </svg>
                            <span className="sr-only">Previous</span>
                        </span>
                    </button>

                    {/* Botón siguiente */}
                    <button
                        type="button"
                        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                        onClick={() => setCurrentIndex((currentIndex + 1) % bannerImages.length)}
                    >
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
                            <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <span className="sr-only">Next</span>
                        </span>
                    </button>
                </div>

                <div className="flex justify-center h-full col-span-1">
                    <div id="imagen" className="w-[380px] bg-[#FE8A5B] rounded-[20px] grid grid-cols-2">
                        <div className="bg-[#FE8A5B] rounded-l-[20px]">
                            <div className="mt-5 ml-5">
                                <p className="text-base text-white">Join Our Animal</p>
                                <p className="text-base text-white">Lovers Community</p>
                            </div>
                            <Button asChild className="mt-5 ml-5">
                                <Link href="/error">Join now</Link>
                            </Button>
                        </div>
                        <div className="bg-[#FE8A5B] flex flex-col-reverse rounded-r-[20px]">
                            <Image src="/promo.png" alt="promo" width={200} height={200} />
                        </div>
                    </div>
                </div>
            </section>

            <div className="mt-5 col-span-2">
                <h2 className="text-texto my-3 font-semibold">Categories</h2>
                <section className="flex justify-between">
                    {/* renderizar los botones de las categorias de forma dinamica*/}
                    <Button
                        className={`h-14 w-14 rounded-xl flex items-center justify-center hover:bg-[#FE8A5B] hover:text-white ${getButtonClasses(selectedCategory === null)}`}
                        onClick={() => {
                            setSelectedCategory(null);
                            seleccionarMascotasPorId(0);
                        }}
                    >
                        All
                    </Button>
                    {loading ? <div>Loading...</div> : categories.map((category) => (
                        <Button 
                            key={category.id_categoria} 
                            className={`h-14 w-14 rounded-xl flex items-center justify-center hover:bg-[#FE8A5B] hover:text-white ${getButtonClasses(selectedCategory === category.id_categoria)}`}
                            onClick={() => {
                                setSelectedCategory(category.id_categoria);
                                seleccionarMascotasPorId(category.id_categoria);
                            }}
                        >
                            <FontAwesomeIcon icon={iconMapping[category.tipo_mascotas as MascotaTipo]} className="text-2xl" />
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
