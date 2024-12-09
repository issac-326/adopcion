'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import PetList from '@/components/ui/PetList';
import Pet from "@/types/Pet";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { faChevronDown, faBell, faPaw, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCategorias, getCategoriaEspecifica, getDepartamentos } from "@/app/menu/inicio/actions"; // Corrige según la ruta correcta de tus acciones
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import PetCardSkeleton from '@/components/ui/petCardSkeleton';
import { getUserProfile } from '@/app/menu/configuraciones/action';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface CometChatResponse {
  authToken: string;
  // otras propiedades que pueda tener la respuesta
}

// Define la interfaz para una mascota individual
interface Mascota {
  id_publicacion: any;
  nombre: any;
  estado_adopcion: any;
  anios: any;
  meses: any;
  ciudad: any;
  imagen: any;
  departamentos: {
    descripcion: any;
  }[];
}
interface Categoria {
  id_categoria: number;
  tipo_mascotas: string;
  color: string;
}

const opcionesSexo = [
  { id: 0, descripcion: "Todos" },
  { id: 1, descripcion: "Hembras" },
  { id: 2, descripcion: "Machos" },
];

const opcionesEdad = [
  { id: 0, descripcion: "Todos" },
  { id: 1, descripcion: "0 a 6 meses" },
  { id: 2, descripcion: "6 meses a 1 año" },
  { id: 3, descripcion: "2 años" },
  { id: 4, descripcion: "3 años" },
  { id: 5, descripcion: "Mayor a 3 años" },
];

const bannerImages = [

  '/adopta.png',
  '/carrusel/2.png',
  '/carrusel/1.avif',
  '/carrusel/3.png',
  '/denuncia-animal.png',
  '/publica-mascota.png',
  '/navega-filtros.png'
];

const colors = ["#f39893", "#7d86a5", "#f5a473", "#acd094"];
const colorsPaws = ["#9e4f4a", "#4a6079", "#a95b3c", "#6f8e65"];

export default function Home() {
  const [isBrowser, setIsBrowser] = useState(false);
  let depa = typeof window !== 'undefined' ? localStorage.getItem('depaSelectedIndex') : '0';
  if (typeof window !== 'undefined') {
    depa = localStorage.getItem('depaSelectedIndex') ? localStorage.getItem('depaSelectedIndex') : '0';
    if (!localStorage.getItem('depaSelectedIndex')) {
      localStorage.setItem('depaSelectedIndex', '0');
    }
  }
  const [selectedMascotas, setSelectedMascotas] = useState<Pet[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [sexoSeleccionado, setSexoSeleccionado] = useState<number>(0);  
  const [edadSeleccionada, setEdadSeleccionada] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPets, setLoadingPets] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const categoriesRef = useRef(null);
  const [depaSeleccionado, setDepaSeleccionado] = useState<number | null>(depa ? parseInt(depa) : 0);
  interface Departamento {
    id: number;
    descripcion: string;
  }
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [page, setPage] = useState(0); // Controla la página actual para la paginación
  const observerRef = useRef(null); // Referencia al sentinela
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [hasMorePets, setHasMorePets] = useState(true);

  const [greeting, setGreeting] = useState(''); // Estado para almacenar el saludo

  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedIndex', '0');
  }

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    const fetchGreeting = async () => {
      const user = await getUserProfile().catch(() => ({ nombre1: 'Usuario' }));
      const currentHour = new Date().getHours();
      let greetingMessage = '';

      if (currentHour < 12) {
        greetingMessage = `¡Buenos días ${user.nombre1}! ☀️`;
      } else if (currentHour < 18) {
        greetingMessage = `¡Buenas tardes ${user.nombre1}! ☀️`;
      } else {
        greetingMessage = `¡Buenas noches ${user.nombre1}!🌙`;
      }

      setGreeting(greetingMessage); // Guarda el saludo en el estado
    };

    fetchGreeting();
  }, []);

  useEffect(() => {
    const loginCometChat = async () => {
      try {
        const user = await getUserProfile();
        const userIdAsString = user.id_usuario.toString();

        const { loginCometChatUser } = await import("@/lib/cometChat");
        
        const response = await loginCometChatUser(userIdAsString, user.nombre1 + ' ' + user.apellido1, user.imagen);
        
        if (response && 'authToken' in response && typeof response.authToken === 'string') {
          if (typeof window !== 'undefined'){
            localStorage.setItem('authToken', response.authToken);
          }
        }
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
      }
    };
  
    loginCometChat();
  }, []);
  
  useLayoutEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setPage((prevPage) => {
            const newPage = prevPage + 1;
            return newPage;
          });
          observer.unobserve(entry.target);
        }
      });
    });

    if (observerRef.current) {
      observer.observe(observerRef.current); // Observa el div al final de la lista
    } else {
      console.warn("observerRef.current es null, no se puede observar el sentinela");
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef.current]);

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
    seleccionarMascotasPorIdCatIdDepa(selectedCategory, sexoSeleccionado, depaSeleccionado, edadSeleccionada, 0);
  }, []);

  interface MascotaData {
    id: number;
    name: string;
    // Add other properties as needed
  }

  interface CategoriaEspecificaResponse {
    length: number;
    data: MascotaData[];
  }

  const seleccionarMascotasPorIdCatIdDepa = async (id: number = 0, id_sexo: number | null, id_departamento: number | null, id_edad: number| null, page: number = 0): Promise<void> => {
    if (!hasMorePets) {
      return; // Si no hay más mascotas, detenemos la ejecución
    }

    try {
      setLoadingPets(true);
      const limit = 10;
      const offset = page * limit;
    
      const mascotas = await getCategoriaEspecifica(
        id, 
        id_departamento ?? 0, 
        id_sexo ?? 0, 
        id_edad ?? 0, 
        limit, 
        offset
      ) as Pet[];  // Usar aserción de tipo aquí
    
      if (mascotas.length < limit) {
        setHasMorePets(false);
      }
    
      setSelectedMascotas((prevMascotas: Pet[]) => [...prevMascotas, ...mascotas]);
    } catch (error) {
      console.error("Error al obtener la categoría específica:", error);
    } finally {
      setLoadingPets(false);
    }
  };

  /* Se ejecuta cuando cambia el departamento */
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    if(typeof window !== 'undefined'){
      localStorage.setItem('depaSelectedIndex', (depaSeleccionado ?? 0).toString());
    }
    // Reiniciamos la lista de mascotas, el flag de más mascotas y la paginación
    setHasMorePets(true);
    setSelectedMascotas([]);
    setPage(0); // Reiniciamos la página

    // Realizamos la búsqueda directamente con categoría 0 (todas las categorías)
    seleccionarMascotasPorIdCatIdDepa(selectedCategory, sexoSeleccionado, depaSeleccionado, edadSeleccionada, 0);
  }, [depaSeleccionado]);

  /* Se ejecuta cuando cambia la categoría */
  useEffect(() => {
    if (isInitialRender) {
      return;
    }

    // Reiniciamos la lista de mascotas y el flag de más mascotas
    setSelectedMascotas([]);
    setHasMorePets(true);
    setPage(0); // Reiniciamos la página

    // Realizamos la búsqueda cuando cambia la categoría
    seleccionarMascotasPorIdCatIdDepa(selectedCategory, sexoSeleccionado, depaSeleccionado, edadSeleccionada, 0);
  }, [selectedCategory]);

  // Lógica para el cambio de sexo
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    if(typeof window !== 'undefined'){
      localStorage.setItem('sexoSelectedIndex', (sexoSeleccionado ?? 0).toString());
    }

    // Reiniciamos la lista de mascotas, el flag de más mascotas y la paginación
    setHasMorePets(true);
    setSelectedMascotas([]);
    setPage(0); // Reiniciamos la página

    // Realizamos la búsqueda directamente con categoría 0 (todas las categorías)
    seleccionarMascotasPorIdCatIdDepa(selectedCategory, sexoSeleccionado, depaSeleccionado, edadSeleccionada, 0);
  }, [sexoSeleccionado]);


  // Lógica para el cambio de edad
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    if(typeof window !== 'undefined'){
      localStorage.setItem('edadSelectedIndex', (edadSeleccionada ?? 0).toString());
    }

    // Reiniciamos la lista de mascotas, el flag de más mascotas y la paginación
    setHasMorePets(true);
    setSelectedMascotas([]);
    setPage(0); // Reiniciamos la página

    // Realizamos la búsqueda directamente con categoría 0 (todas las categorías)
    seleccionarMascotasPorIdCatIdDepa(selectedCategory, sexoSeleccionado, depaSeleccionado, edadSeleccionada, 0);
  }, [edadSeleccionada]);

  /* Se ejecuta cuando cambia la página */
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    // Realizamos la búsqueda cuando cambia la página
    seleccionarMascotasPorIdCatIdDepa(selectedCategory, sexoSeleccionado, depaSeleccionado, edadSeleccionada, page);
  }, [page]);


  /* Traer los departamentos al cargar la pagina */
  useEffect(() => {
    try {

      const obtenerDepartamentos = async () => {
        const data = await getDepartamentos();
        setDepartamentos(data);
      };

      obtenerDepartamentos();

    } catch (error) {
      console.error("Error al obtener los departamentos:", error);
    }
  }, [])

  /* cada que cambiemos lhas mascotas seleccionadas las volvera a renderizar */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);


  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };
  if (!isBrowser) {
    return <div>Cargando...</div>; // o null, o tu componente de carga
  }
  return (
    <div className='mx-4 my-4' >
      <div id="encabezado" className="mb-2 flex justify-between text-[#03063a]">
        {/* esta renderiza toda la parte de arriba del home */}
        <h1 className="text-2xl font-normal text-center text-gray-700">
          {greeting} {/* Muestra un texto mientras carga */}
        </h1>

        <div className="flex gap-2">
          <span className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#f7f7f8] hover:cursor-pointer" aria-haspopup="dialog"
            aria-expanded={isOffcanvasOpen}
            aria-controls="hs-offcanvas-right"
            onClick={toggleOffcanvas}
          ><FontAwesomeIcon icon={faBell as IconProp} className="w-6" /></span>
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
                <p className="text-base text-white">Comunidad de</p>
                <p className="text-base text-white">Amantes de Mascotas</p>
              </div>
              <Button asChild className="mt-5 ml-5 relative z-30">
                <Link href="/error">Únete ahora</Link>
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
        tabIndex={-1}
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

      <div className={`py-2 w-full sticky z-20 top-0 bg-white transition-shadow duration-300}`} >
      <div className="mb-2 flex justify-between text-[#03063a]">
      {/* Categorías */}
      <h2 className="text-texto mt-5 font-montserrat text-xl font-medium">Categorias</h2>
      
      <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton>
              <div className="flex items-center gap-2 mt-5">
                <div className="flex gap-2 text-sm text-gray-400 items-center">Ubicación <FontAwesomeIcon icon={faChevronDown as IconProp} className="w-3" /></div>
                <span className="font-extrabold">{depaSeleccionado === 0 ? 'Todos' : departamentos.find(dep => dep.id === depaSeleccionado)?.descripcion},</span> HN
              </div>
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute left-0 z-40 mt-2 w-max origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none justify-start data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in grid grid-cols-3 gap-x-4"
          >
            <MenuItem key={0} onClick={() => setDepaSeleccionado(0)} as="div" className="flex justify-start justify-center">
              <a
                className="block text-left w-max-8 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 text-center"
              >
                Todos
              </a>
            </MenuItem>
            {departamentos && departamentos.length > 0 ? (
              departamentos.map((departamento, index) => (
                <MenuItem key={departamento.id} onClick={() => {
                  setDepaSeleccionado(departamento.id)
                }} as="div" className="flex justify-start justify-center">
                  <a
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
        {/* Menú de Sexo */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton>
              <div className="flex items-center gap-2 mt-5">
                <div className="flex gap-2 text-sm text-gray-400 items-center">
                  Sexo <FontAwesomeIcon icon={faChevronDown as IconProp} className="w-3" />
                </div>
                <span className="font-extrabold">
                  {opcionesSexo.find((opcion) => opcion.id === sexoSeleccionado)?.descripcion || "Todos"}
                </span>
              </div>
            </MenuButton>
          </div>

          <MenuItems
            className="absolute left-0 z-40 mt-2 w-max origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none justify-start grid grid-cols-1 gap-x-4"
          >
            {/* Opciones de sexo */}
            {opcionesSexo.map((opcion) => (
              <MenuItem
                key={opcion.id}
                onClick={() => setSexoSeleccionado(opcion.id)}
                as="div"
                className="flex justify-center"
              >
                <a className="block text-left w-max px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 text-center">
                  {opcion.descripcion}
                </a>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>

        {/* Menú de edad */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton>
              <div className="flex items-center gap-2 mt-5">
                <div className="flex gap-2 text-sm text-gray-400 items-center">
                  Edad <FontAwesomeIcon icon={faChevronDown as IconProp} className="w-3" />
                </div>
                <span className="font-extrabold">
                  {opcionesEdad.find((opcion) => opcion.id === edadSeleccionada)?.descripcion || "Todos"}
                </span>
              </div>
            </MenuButton>
          </div>

          <MenuItems
            className="absolute left-0 z-40 mt-2 w-max origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none justify-start grid grid-cols-1 gap-x-4"
          >
            {/* Opciones de sexo */}
            {opcionesEdad.map((opcion) => (
              <MenuItem
                key={opcion.id}
                onClick={() => setEdadSeleccionada(opcion.id)}
                as="div"
                className="flex justify-center"
              >
                <a className="block text-left w-max px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 text-center">
                  {opcion.descripcion}
                </a>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>

      <div
        id="categorias"
        ref={categoriesRef}
        className={`py-2 w-full bg-white transition-shadow duration-300}`}
      >
        <section className="flex justify-between h-[40px] gap-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => ( // Cambia 5 por el número de skeletons que deseas mostrar
              <div
                key={index}
                className="flex-1 p-2 rounded-lg relative border-box flex items-center justify-center font-light bg-gray-300 animate-pulse" // Añadido animate-pulse para el efecto de carga
                style={{ backgroundColor: 'lightgray' }} // Color de fondo del skeleton
              >
              </div>
            ))
          ) : (
            <>
              <div
                className={`flex-1 bg-[#21888d] font-light p-2 rounded-lg relative hover:scale-105 flex shadow-[0_4px_4px_rgba(0,0,0,0.25)] items-center justify-center ${selectedCategory === 0 ? 'border-2 border-[#020817]' : ''
                  }`}
                onClick={() => {
                  setSelectedCategory(0);
                }}
              >
                <p className="font-normal text-base text-center">Todos</p>
                <FontAwesomeIcon
                  icon={faPaw as IconProp}
                  rotation={180}
                  className="absolute top-2 right-4 text-[#135556] opacity-30 transform -rotate-12 text-3xl"
                />
              </div>

              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`flex-1 p-2 rounded-lg relative hover:scale-105 border-box flex items-center justify-center shadow-[0_4px_4px_rgba(0,0,0,0.25)] font-light ${selectedCategory === category.id_categoria ? 'border-2 border-[#020817]' : ''
                    }`}
                  style={{ backgroundColor: colors[index] }} // Aplicando el color dinámicamente
                  onClick={() => {
                    setSelectedCategory(category.id_categoria);
                  }}
                >
                  <p className="font-normal text-base text-center">{category.tipo_mascotas}</p>
                  <FontAwesomeIcon
                    icon={faPaw as IconProp}
                    rotation={180}
                    style={{ color: colorsPaws[index] }}
                    className="absolute top-2 right-4 opacity-30 transform -rotate-12 text-3xl"
                  />
                </div>
              ))}
            </>
          )}




        </section>
      </div>
      </div>
      {/* Mascotas */}
      <section className="mt-5 flex justify-between items-center">
        <h2 className="font-montserrat text-xl font-medium">Esperando por ti...</h2>
      </section>

      {loadingPets ? (
        <>
          {selectedMascotas.length > 0 ? (
            <>
              <PetList pets={selectedMascotas} />
            </>
          ) : (
            <PetCardSkeleton />
          )}
        </>
      ) : (
        <>
          {selectedMascotas.length > 0 ? (
            <PetList pets={selectedMascotas} />
          ) : (
            <div className='text-[#f5a473]'>No hay mascotas disponibles 😿</div>
          )}
          <div id='obsevando' ref={observerRef} />
        </>
      )}


    </div>
  );
};

