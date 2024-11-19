'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const LandingPage = () => {

    const mascotas = [
        "nami.jpeg",
        "camila.jpeg",
        "paquito.avif",
        "Garufa.jpg",
        "Sasha.jpg",
        "Penelope.jpg",
        "Ragnar.jpg",
        "LeoPicon.jpg",
        "Kirara.jpg",
        "Trix.jpg",
        "monchito.avif",
        "lara.avif"
      ];
    
  // Estado para manejar el índice del carrusel general
  const [currentIndex, setCurrentIndex] = useState(0);
  const banners = ["Banner 1", "Banner 2", "Banner 3"]; // Define los textos del carrusel
  const router = useRouter();
  // Estado para manejar el índice del carrusel de testimonios
  const [testimonioIndex, setTestimonioIndex] = useState(0);
  const testimonios = [
    {
      texto: "Gracias a Pet Finder encontré a mi mejor amigo. Ha cambiado mi vida para siempre. ¡Estoy muy agradecida!",
      nombre: "María Gómez",
      imagen: "/Rufo.jpg",
      imagenPerfil: "/usuario-default.png",
    },
    {
      texto: "Adoptar fue la mejor decisión. Mi nueva compañera llena mi hogar de alegría todos los días.",
      nombre: "Sara Contreras",
      imagen: "/Gladis.jpg", 
      imagenPerfil: "/usuario-default.png", 
    },
    {
      texto: "Adopté gatitos y no podría estar más feliz. La experiencia fue sencilla y muy gratificante.",
      nombre: "Oscar Flores",
      imagen: "/Twins.avif", // Imagen del testimonio
      imagenPerfil: "/usuario-default.png", // Imagen de perfil única
    },
  ];
  
  // Lógica para manejar el clic del botón anterior (banner)
const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };
  
  // Lógica para manejar el clic del botón siguiente (banner)
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };
  
  // Lógica para el carrusel de testimonios
  const handleTestimonioPrev = () => {
    setTestimonioIndex((prevIndex) =>
      prevIndex === 0 ? testimonios.length - 1 : prevIndex - 1
    );
  };

  const handleTestimonioNext = () => {
    setTestimonioIndex((prevIndex) =>
      prevIndex === testimonios.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      {/* Encabezado */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-orange-500">Pet Finder</h1>
          <nav className="flex space-x-4">
            <a href="#inicio" className="hover:text-orange-500">Inicio</a>
            <a href="#acerca" className="hover:text-orange-500">Acerca de</a>
            <a href="#contacto" className="hover:text-orange-500">Contacto</a>
          </nav>
        </div>
      </header>

      {/* Banner Principal */}
      <section
  id="inicio"
  className="relative w-full h-[60vh] bg-gradient-to-r from-blue-400 to-purple-400 text-white mt-16 flex items-center justify-start pl-10 overflow-hidden"
>
  {/* Imagen como fondo */}
  <div className="absolute inset-0">
    <Image
      src="/mascota-feliz (4).png"
      alt="mascota"
      layout="fill"
      objectFit="cover"
      className="opacity-100" // Ajusta la opacidad si deseas un efecto más tenue
    />
  </div>

  {/* Contenido superpuesto */}
  <div className="relative z-15 text-center">
    <h1 className="text-3xl font-bold mb-4">Encuentra a tu Compañero Perfecto</h1>
    <p className="text-lg mb-6">Conectamos mascotas con sus futuros hogares.</p>
    <button
      className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
      onClick={() => router.push('/login')}
    >
      Comienza a adoptar
    </button>
  </div>
</section>

   {/* Sección Acerca de */}
<section id="acerca" className="py-16 bg-f4f0fd">
  <div className="w-4/5 mx-auto max-w-screen-lg">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1 */}
      <div className="bg-gray-300 rounded-lg shadow-lg p-6 text-center hover:bg-gray-400  hover:shadow-xl transition">
        <FontAwesomeIcon icon={faSearch  as IconProp} className="text-4xl text-orange-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Busca Mascotas</h3>
        <p>Filtra por ubicación, raza o edad para encontrar a tu nueva mascota.</p>
      </div>
      {/* Card 2 */}
      <div className="bg-gray-300 rounded-lg shadow-lg p-6 text-center hover:bg-gray-400 hover:shadow-xl transition">
        <FontAwesomeIcon icon={faHeart  as IconProp} className="text-4xl text-orange-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Adopta</h3>
        <p>Conoce a nuestras mascotas y da un hogar a quien lo necesita.</p>
      </div>
      {/* Card 3 */}
      <div className="bg-gray-300 rounded-lg shadow-lg p-6 text-center hover:bg-gray-400  hover:shadow-xl transition">
        <FontAwesomeIcon icon={faPaw as IconProp} className="text-4xl text-orange-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Registra Mascotas</h3>
        <p>Publica perfiles de mascotas para ayudar a encontrarlas un hogar.</p>
      </div>
    </div>
  </div>
</section>

{/* Sección Conócenos */}
<section id="conocenos" className="py-16 bg-f9f9f9">
  <div className="container mx-auto flex flex-col md:flex-row items-center" style={{ width: '85%' }}>
    {/* Imagen */}
    <div className="w-full md:w-1/2 mb-8 md:mb-0">
      <Image
        src="/perro-2.png"
        alt="Perro feliz"
        width={600}
        height={500}
        className=""
      />
    </div>

    {/* Contenido */}
    <div className="w-full md:w-1/2 px-6">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        Nuestro Trabajo
      </h1>
      <p className="text-gray-600 mb-4">
        En Pet Finder, nos dedicamos a conectar mascotas sin hogar con familias
        que están buscando compañeros para toda la vida. A través de nuestro
        esfuerzo y compromiso, ayudamos a transformar vidas, promoviendo la
        adopción responsable y proporcionando un futuro lleno de amor y alegría
        para nuestros amigos de cuatro patas.
      </p>
      <ul className="space-y-4">
        <li className="flex items-center">
          <FontAwesomeIcon
            icon={faPaw  as IconProp}
            className="text-orange-500 text-2xl mr-3"
          />
          <span className="text-gray-700">
            Facilitamos el proceso de adopción de manera simple y segura.
          </span>
        </li>
        <li className="flex items-center">
          <FontAwesomeIcon
            icon={faHeart  as IconProp}
            className="text-orange-500 text-2xl mr-3"
          />
          <span className="text-gray-700">
            Colaboramos con refugios para promover la adopción.
          </span>
        </li>
        <li className="flex items-center">
          <FontAwesomeIcon
            icon={faSearch  as IconProp}
            className="text-orange-500 text-2xl mr-3"
          />
          <span className="text-gray-700">
            Ayudamos a encontrar mascotas según tus preferencias.
          </span>
        </li>
      </ul>
    </div>
  </div>
</section>


{/* Sección Conoce a Nuestras Mascotas */}
<section id="conoce-mascotas" className="py-16">
  <div className="container mx-auto text-center" style={{ width: '85%' }}>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Conoce a Nuestras Mascotas</h2>
    <p className="text-gray-600 mb-8">Descubre las adorables mascotas que están buscando un hogar lleno de amor.</p>
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {Array.from({ length: Math.ceil(mascotas.length / 4) }).map((_, pageIndex) => (
          <div key={pageIndex} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0 w-full">
            {mascotas.slice(pageIndex * 4, pageIndex * 4 + 4).map((image, index) => (
              <div key={index} className="relative group">
                <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`/${image}`}
                    alt={`Mascota ${pageIndex * 4 + index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-orange-500 text-white px-3 py-2 rounded-full hover:bg-orange-600"
        onClick={handlePrev}
      >
        &#8592;
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-orange-500 text-white px-3 py-2 rounded-full hover:bg-orange-600"
        onClick={handleNext}
      >
        &#8594;
      </button>
    </div>
  </div>
</section>

 {/*Historias de adopcion*/}
      <section id="testimonios" className="py-16">
  <div className="container mx-auto flex flex-col md:flex-row md:justify-between items-center">
    {/* Imagen del testimonio */}
    <div className="w-full md:w-1/3 ml-10">
      <img
        src={testimonios[testimonioIndex].imagen}
        alt="Imagen del testimonio"
        className="rounded-lg shadow-lg transition-transform duration-500 transform hover:scale-400 mb-10 md:ml-40 mx-30 w-80 h-80 object-cover"
      />
    </div>

    {/* Contenido del testimonio */}
    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left ml-10 mr-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Historias de Adopción
      </h2>
      <blockquote className="italic text-gray-600 text-lg mb-6">
        "{testimonios[testimonioIndex].texto}"
      </blockquote>
      <hr className="w-1/3 border-orange-500 mb-6" />
      {/* Foto de perfil e información del usuario */}
      <div className="flex items-center mb-4">
        <img
          src={testimonios[testimonioIndex].imagenPerfil}
          alt={`Foto de perfil de ${testimonios[testimonioIndex].nombre}`}
          className="w-16 h-16 rounded-full mr-4 object-cover"
        />
        <span className="text-orange-500 font-bold text-lg">
          {testimonios[testimonioIndex].nombre}
        </span>
      </div>
      {/* Botones de navegación */}
      <div className="mt-6 flex space-x-6">
        <button
          className="text-orange-500 text-3xl hover:text-orange-600 transition"
          onClick={handleTestimonioPrev}
        >
          &#8249;
        </button>
        <button
          className="text-orange-500 text-3xl hover:text-orange-600 transition"
          onClick={handleTestimonioNext}
        >
          &#8250;
        </button>
      </div>
    </div>
  </div>
</section>


{/* Adopcion*/}
<section className="py-16">
  <div className="w-4/5 mx-auto flex flex-col lg:flex-row items-center lg:space-x-8">
    <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
      <img src="/Gatocat.png" alt="Gatocat" className="rounded-lg mx-auto lg:mx-0" />
    </div>
    <div className="w-full lg:w-1/2 flex flex-col space-y-6">
      <h2 className="text-3xl font-bold text-black mb-4">Beneficios de Adoptar</h2>
      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
        <div className="flex-1 bg-gray-300 p-6 rounded-lg shadow-md hover:bg-gray-400  hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-orange-600 mb-4">Salvas una Vida</h3>
          <p className="text-black">Dar un hogar a una mascota significa salvarla de un refugio o situación difícil.</p>
        </div>
        <div className="flex-1 bg-gray-300 p-6 rounded-lg shadow-md hover:bg-gray-400  hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-orange-600 mb-4">Mejoras tu Salud</h3>
          <p className="text-black">Las mascotas ayudan a reducir el estrés y fomentar la actividad física.</p>
        </div>
      </div>
      <div className="flex bg-gray-300 p-6 rounded-lg shadow-md hover:bg-gray-400 hover:shadow-lg transition">
        <h3 className="text-lg font-bold text-orange-600 mb-4">Cuidas el Medio Ambiente</h3>
        <p className="text-black">Adoptar ayuda a controlar la sobrepoblación de animales.</p>
      </div>
    </div>
  </div>
</section>

{/* Pie de Página */}
<footer id="contacto" className="bg-white text-gray-700 py-12">
  <div
    className="mx-auto w-[80%] flex flex-wrap items-center justify-between"
    style={{ maxWidth: "80%" }} // Cambié el maxWidth al 80%
  >
    {/* Sección del logo */}
    <div className="flex flex-col items-center sm:items-start">
      <img
        src="/Logo.svg"
        alt="Logo de Pet Finder"
        style={{
          width: '8rem', // Tamaño ajustado del logo
          height: '8rem',
          objectFit: 'contain',
        }}
      />
    </div>

    {/* Mantente conectado */}
    <div className="text-center">
      <h3 className="text-lg font-bold">Síguenos en redes sociales</h3>
      <div className="flex justify-center space-x-4 mt-4">
        <a href="https://www.instagram.com/petfinderhn/" className="text-orange-500 hover:text-orange-600">
          <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
        </a>
        <a href="https://x.com/petfinderhn" className="text-orange-500 hover:text-orange-600">
          <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
        </a>
        <a href="https://www.facebook.com/profile.php?id=61563627188556" className="text-orange-500 hover:text-orange-600">
          <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
        </a>
      </div>
    </div>

    {/* Políticas */}
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold">Políticas</h3>
      <ul className="space-y-2">
        <li>
          <a href="/Landing/politica" className="hover:text-orange-500 underline">
            Política de Privacidad
          </a>
        </li>
      </ul>
    </div>

    {/* Contacto */}
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold">Contacto</h3>
      <p>
        Correo:{" "}
        <a
          href="mailto:petfinder.hn@gmail.com"
          className="hover:text-orange-500 underline"
        >
          petfinder.hn@gmail.com
        </a>
      </p>
      <p>Teléfono: +504 9813-8001</p>
    </div>
  </div>

  {/* Derechos Reservados */}
  <div className="mt-8 text-center border-t pt-4">
    <p className="text-sm">© 2024 Pet Finder. Todos los derechos reservados.</p>
  </div>
</footer>

    </>
  );
};

export default LandingPage;