'use client'; 

import React, { useState, useEffect, useRef } from 'react'; 
import PetList from '@/components/ui/PetList';
import Pet from "@/types/Pet";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { faMagnifyingGlass, faChevronDown, faBell, faPaw } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCategorias, getCategoriaEspecifica, getDepartamentos } from "@/app/menu/inicio/actions"; // Corrige según la ruta correcta de tus acciones
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import PetCardSkeleton from '@/components/ui/petCardSkeleton';

interface Categoria {
  id_categoria: number;
  tipo_mascotas: string;
  color: string;
}

const bannerImages = [
  '/adopta.png',
  '/denuncia-animal.png',
  '/publica-mascota.png',
  '/navega-filtros.png'
];

const colors = ["#f39893", "#7d86a5", "#f5a473", "#acd094"];
const colorsPaws = ["#9e4f4a", "#4a6079", "#a95b3c", "#6f8e65"];

export default function Home() {
  const [selectedMascotas, setSelectedMascotas] = useState<Pet[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPets, setLoadingPets] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [departamentos, setDepartamentos] = useState([]);
  const [isSticky, setIsSticky] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const stickyRef = useRef(null);

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
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting); // Cambia el estado a sticky cuando ya no esté intersectando
      },
      { root: null, threshold: [0.5] } // Activa cuando el div está al 50% fuera de la vista
    );

    if (stickyRef.current) {
      observer.observe(stickyRef.current);
    }

    return () => {
      if (stickyRef.current) {
        observer.unobserve(stickyRef.current);
      }
    };
  }, []);


  /* Traer los departamentos al cargar la pagina */
  useEffect(() => {
    try {

      const obtenerDepartamentos = async () => {
        const data = await getDepartamentos();
        console.log("Departamentos obtenidos:", data);
        setDepartamentos(data);
      };

      obtenerDepartamentos();

    } catch (error) {
      console.error("Error al obtener los departamentos:", error);
    }
  }, [])

  useEffect(() => {
    setLoadingPets(true);
    manejarMascotas(selectedMascotas);
  }, [selectedMascotas]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const seleccionarMascotasPorId = async (id: number) => {
    setLoadingPets(true);
    try {
      const data = await getCategoriaEspecifica(id);
      setSelectedMascotas(data ?? []);
    } catch (error) {
      setLoadingPets(false);
      console.error("Error al obtener la categoría específica:", error);
    }
  };

  const manejarMascotas = (mascotas: Pet[]) => {
    setSelectedMascotas(mascotas);
    setLoadingPets(false);
  };

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  return (
    <div className="bg-white border my-2 mx-4 px-4 pb-4 rounded-xl shadow-[0_4px_8px_rgba(0,0,255,0.2),0_2px_4px_rgba(0,0,0,0.1)] flex flex-col ">
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
            className="absolute left-0 z-40 mt-2 w-max origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none justify-start data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in grid grid-cols-3 gap-x-4"
          >
            {departamentos && departamentos.length > 0 ? (
              departamentos.map((departamento, index) => (
                <MenuItem key={departamento.id} as="div" className="flex justify-start justify-center">
                  <a
                    href="#"
                    className="block text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 text-center"
                  >
                    {departamento.descripcion}
                  </a>
                </MenuItem>
              ))
            ) : (
              <MenuItem as="div">
                <span className="block px-4 py-2 text-sm text-gray-700">No hay departamentos disponibles</span>
              </MenuItem>
            )}
          </MenuItems>


        </Menu>

        <div className="flex gap-2">
          <span className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#f7f7f8] hover:cursor-pointer" aria-haspopup="dialog"
            aria-expanded={isOffcanvasOpen}
            aria-controls="hs-offcanvas-right"
            onClick={toggleOffcanvas}
          ><FontAwesomeIcon icon={faBell} className="w-6" /></span>
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
  <div id="imagen" className="w-[380px] bg-[#FE8A5B] rounded-[20px] relative">
    <div className="bg-[#FE8A5B] rounded-l-[20px] relative z-20">
      <div className="mt-5 ml-5">
        <p className="text-base text-white">Join Our Animal</p>
        <p className="text-base text-white">Lovers Community</p>
      </div>
      <Button asChild className="mt-5 ml-5 relative z-30">
        <Link href="/error">Join now</Link>
      </Button>
    </div>
    
    <div className="absolute z-10 -right-0 bottom-0 bg-[#FE8A5B] flex flex-col-reverse rounded-r-[20px]">
      <Image src="/promo.png" alt="promo" width={130} height={130} />
    </div>
  </div>
</div>

      </section>

      {/* Notificaciones sidebar */}
      <div
        id="hs-offcanvas-right"
        className={`hs-overlay ${isOffcanvasOpen ? 'translate-x-0' : 'translate-x-full hidden'} fixed top-0 end-0 transition-all duration-300 transform h-full max-w-xs w-full z-[80] bg-white border-s dark:bg-neutral-800 dark:border-neutral-700`}
        role="dialog"
        tabIndex="-1"
        aria-labelledby="hs-offcanvas-right-label"
      >
        <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
          <h3 id="hs-offcanvas-right-label" className="font-bold text-gray-800 dark:text-white">
            Notificaciones
          </h3>
          <button
            type="button"
            className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
            aria-label="Close"
            onClick={toggleOffcanvas}
          >
            <span className="sr-only">Close</span>
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-800 dark:text-neutral-400">
            Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
          </p>
        </div>
      </div>

      {/* Categorías */}
      <h2 className="text-texto mt-5 font-montserrat text-xl font-medium">Categories</h2>
      <div
        ref={stickyRef}
        className={`py-2 w-full sticky z-20 top-0 bg-white transition-shadow duration-300 ${isSticky ? 'shadow-lg border-2' : ''
          }`}
      >
        <section className="flex justify-between h-[40px] gap-4">
          <div
            className={`flex-1 bg-[#21888d] p-2 rounded-lg relative hover:scale-105 flex items-center justify-center ${selectedCategory === null ? 'border-2 border-[#020817]' : ''
              }`}
            onClick={() => {
              setSelectedCategory(null);
              seleccionarMascotasPorId(0);
            }}
          >
            <p className="font-medium text-base text-center">Todos</p>
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
                className={`flex-1 p-2 rounded-lg relative hover:scale-105 border-box flex items-center justify-center font-normal ${selectedCategory === category.id_categoria ? 'border-2 border-[#020817]' : ''
                  }`}
                style={{ backgroundColor: colors[index] }} // Aplicando el color dinámicamente
                onClick={() => {
                  setSelectedCategory(category.id_categoria);
                  seleccionarMascotasPorId(category.id_categoria);
                }}
              >
                <p className="font-medium text-base text-center">{category.tipo_mascotas}</p>
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

      {/* Mascotas */}
      <section className="mt-5 flex justify-between items-center">
        <h2 className="font-montserrat text-xl font-medium">Adopt pet</h2>
      </section>

      {loadingPets ? (
        <PetCardSkeleton />
      ) : (
        <PetList pets={selectedMascotas} />
      )}
    </div>
  );
};
