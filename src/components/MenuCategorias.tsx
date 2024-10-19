'use client';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { faMagnifyingGlass, faChevronDown, faBell, faChevronRight, faPaw } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCategorias, getCategoriaEspecifica } from "@/app/menu/home/actions"; // O `inicial/actions` según necesites
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Pet from "@/types/Pet";

/* todas las interfaces son por el tipado de typescript */
interface Categoria {
    id_categoria: number;
    tipo_mascotas: string;
    color: string;
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
    const [isSticky, setIsSticky] = useState(false);
    
    const bannerImages = [
        '/adopta.png',
        '/denuncia-animal.png',
        '/publica-mascota.png',
        '/navega-filtros.png'
    ];

    const colors = ["#f39893", "#7d86a5", "#f5a473", "#acd094"];
    const colorsPaws = ["#9e4f4a", "#4a6079", "#a95b3c", "#6f8e65"];

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

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY; // Cambia esto si el scroll no es en el documento completo
            setIsSticky(offset > 0); // Ajusta la condición según lo que necesites
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
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
        <div className="text-[#03063a] bg-white">
            <div id="encabezado" className="mt-8 mb-2 flex justify-between text-[#03063a]">
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <MenuButton>
                            <div>
                                <div className="flex gap-2 text-sm text-gray-400 items-center">Ubicacion <FontAwesomeIcon icon={faChevronDown} className="w-3" /></div>
                                <span className="font-extrabold">TGU,</span> HN
                            </div>
                        </MenuButton>
                    </div>

                    <MenuItems
                        transition
                        className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                        <div className="py-1">
                            <MenuItem>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                >
                                    Account settings
                                </a>
                            </MenuItem>
                            <form action="#" method="POST">
                                <MenuItem>
                                    <button
                                        type="submit"
                                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                    >
                                        Sign out
                                    </button>
                                </MenuItem>
                            </form>
                        </div>
                    </MenuItems>
                </Menu>
                <div className="flex gap-2">
                    <span className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#f7f7f8]"><FontAwesomeIcon icon={faMagnifyingGlass} className="w-6" /></span>
                    <span className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#f7f7f8]"><FontAwesomeIcon icon={faBell} className="w-6" /></span>
                </div>
            </div>

            {/* carrousel */}
            <section className="grid grid-cols-5 gap-4 h-56">
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

{/* Categorías */ }
<div className="mt-5 sticky top-0 z-10 bg-white transition-shadow duration-300">
    <h2 className="text-texto my-3 font-semibold">Categories</h2>
    <section className="flex justify-between h-[50px] gap-4">
        {/* Elemento fijo */}
        <div className="flex-1 bg-[#21888d] p-2 rounded-lg relative hover:scale-105 flex items-center justify-center mx-1"
            onClick={() => {
                setSelectedCategory(null);
                seleccionarMascotasPorId(0);
            }}>
            <p className="font-bold text-base text-center">Todos</p>
            <FontAwesomeIcon
                icon={faPaw}
                rotation={180}
                className="absolute top-2 right-4 text-[#135556] opacity-30 transform -rotate-12 text-3xl"
            />
        </div>

        {loading ? (
            <div>Loading...</div>
        ) : (
            categories.map((category, index) => (
                <div
                    key={index}
                    className="flex-1 p-2 rounded-lg relative hover:scale-105 flex items-center justify-center"
                    style={{ backgroundColor: colors[index] }} // Aplicando el color dinámicamente
                    onClick={() => {
                        setSelectedCategory(category.id_categoria);
                        seleccionarMascotasPorId(category.id_categoria);
                    }}
                >
                    <p className="font-bold text-base text-center">{category.tipo_mascotas}</p>
                    <FontAwesomeIcon
                        icon={faPaw}
                        rotation={180}
                        style={{ color: colorsPaws[index] }}
                        className="absolute top-2 right-4 opacity-30 transform -rotate-12 text-3xl"
                    />
                </div>
            ))
        )}
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

{/* <Button 
    key={category.id_categoria} 
    className={`h-14 w-14 rounded-xl flex items-center justify-center hover:bg-[#FE8A5B] hover:text-white ${getButtonClasses(selectedCategory === category.id_categoria)}`}
    onClick={() => {
        setSelectedCategory(category.id_categoria);
        seleccionarMascotasPorId(category.id_categoria);
    }}
>
    <FontAwesomeIcon icon={iconMapping[category.tipo_mascotas as MascotaTipo]} className="text-2xl" />
</Button> */}