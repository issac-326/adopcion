'use client'; // Asegúrate de que estás en un contexto de cliente
import React, { useState, useEffect, useRef, use } from 'react';  // Consolidamos useState y useEffect en una sola línea
import PetList from '@/components/ui/PetList';
import Pet from "@/types/Pet";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { faMagnifyingGlass, faChevronDown, faBell, faChevronRight, faPaw } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCategorias, getCategoriaEspecifica, getDepartamentos } from "@/app/menu/inicio/actions"; // Corrige según la ruta correcta de tus acciones
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  /* sirve para almacenar el id del departamento seleccionado */
  const [depaSeleccionado, setDepaSeleccionado] = useState<number | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
  const stickyRef = useRef(null); // Referencia al div que se volverá sticky
  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const offsetTop = stickyRef.current.getBoundingClientRect().top;
        setIsSticky(offsetTop <= 0); // Si el top de la referencia es <= 0, es sticky
      }
    };

    // Escuchamos el evento de scroll
    window.addEventListener('scroll', handleScroll);

    // Limpiamos el listener al desmontar el componente
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* obtiene las categorias y las carga en el estado nomas cargar la pagina pone el primer departamento seleccionado que de momento es siempre FM*/
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
    seleccionarMascotasPorIdCatIdDepa(0, 8);
  }, []);

  /* Obtiene los departamentos y los carga en el estado departamentos */
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
    const handleScroll = () => {
      const offset = window.scrollY; // Cambia esto si el scroll no es en el documento completo
      setIsSticky(offset > 0); // Ajusta la condición según lo que necesites
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* cada que cambiemos las mascotas seleccionadas las volvera a renderizar */
  useEffect(() => {
    manejarMascotas(selectedMascotas);
  }, [selectedMascotas]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

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

  const seleccionarMascotasPorIdCatIdDepa = async (id: number, id_departamento: number) => {
    try {
      const data = await getCategoriaEspecifica(id, id_departamento);
      setSelectedMascotas(data ?? []);
      setDepaSeleccionado(id_departamento);
    } catch (error) {
      console.error("Error al obtener la categoría específica:", error);
    }
  };

  const manejarMascotas = (mascotas: Pet[]) => {
    setSelectedMascotas(mascotas);
  };

  return (
    <div className="bg-white border my-2 mx-4 px-4 pb-4 rounded-xl shadow-[0_4px_8px_rgba(0,0,255,0.2),0_2px_4px_rgba(0,0,0,0.1)] flex flex-col ">
      <div id="encabezado" className="mt-8 mb-2 flex justify-between text-[#03063a]">
        {/* esta renderiza toda la parte de arriba del home */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton>
              <div>
                <div className="flex gap-2 text-sm text-gray-400 items-center">Ubicacion <FontAwesomeIcon icon={faChevronDown} className="w-3" /></div>
                <span className="font-extrabold">{departamentos.find(dep => dep.id === depaSeleccionado)?.descripcion},</span> HN
                
              </div>
            </MenuButton>
          </div>

          <MenuItems
          transition
          className="absolute left-0 z-40 mt-2 w-max origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none justify-start data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in grid grid-cols-3 gap-x-4"
        >
  {departamentos && departamentos.length > 0 ? (
    departamentos.map((departamento, index) => (
      <MenuItem key={departamento.id} onClick={() => {
        seleccionarMascotasPorIdCatIdDepa(0, departamento.id);
        }} as="div" className="flex justify-start justify-center"> 
          <a
            onClick={() => setCurrentIndex(index)}
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

      {/* Categorías */}
      <h2 className="text-texto mt-5 font-semibold">Categories</h2>
      <div
        className={`py-2 w-full sticky z-20 top-0 bg-white transition-all duration-300 ${isSticky ? 'shadow-[0_8px_16px_rgba(0,0,0,0.4)] w-full ' : 'shadow-none'}`}
      >


        <section className="flex justify-between h-[50px] gap-4">
          {/* Elemento fijo */}
          <div className="flex-1 bg-[#21888d] p-2 rounded-lg relative hover:scale-105 flex items-center justify-center mx-1"
            onClick={() => {
              setSelectedCategory(null);
              
              // Comprobar que depaSeleccionado no sea null
              if (depaSeleccionado !== null) {
                seleccionarMascotasPorIdCatIdDepa(0, depaSeleccionado);
              } else {
                // Manejo adicional si depaSeleccionado es null (opcional)
                console.warn('depaSeleccionado es null, no se llamará a seleccionarMascotasPorIdCatIdDepa');
              }
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
                  
                  // Comprobar que depaSeleccionado no sea null
                  if (depaSeleccionado !== null) {
                    seleccionarMascotasPorIdCatIdDepa(category.id_categoria, depaSeleccionado);
                  } else {
                    // Manejo adicional si depaSeleccionado es null (opcional)
                    console.warn('depaSeleccionado es null, no se llamará a seleccionarMascotasPorIdCatIdDepa');
                  }
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

      <PetList pets={selectedMascotas} />
    </div>


  );
};
