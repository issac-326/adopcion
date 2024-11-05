'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { faGear, faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button'; 
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient'; 

interface MenuItem {
  icon: JSX.Element;
  label: string;
}

export default function Header() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  // Cargar el índice seleccionado desde localStorage al inicio
  useEffect(() => {
    const storedIndex = localStorage.getItem('selectedIndex');
    if (storedIndex) {
      setSelectedIndex(Number(storedIndex));
    }
  }, []);

  const menuItems: MenuItem[] = [
    { icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M180-475q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180-160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm240 0q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180 160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM266-75q-45 0-75.5-34.5T160-191q0-52 35.5-91t70.5-77q29-31 50-67.5t50-68.5q22-26 51-43t63-17q34 0 63 16t51 42q28 32 49.5 69t50.5 69q35 38 70.5 77t35.5 91q0 47-30.5 81.5T694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z" /></svg>, label: "Inicio" },
    { icon: <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />, label: "Favoritos" },
    { icon: <FontAwesomeIcon icon={faCommentDots} className="w-5 h-5" />, label: "Mensaje" },
    { icon: <FontAwesomeIcon icon={faUser} className="w-5 h-5" />, label: "Perfil" },
    { icon: <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />, label: "Publicar" },
    { icon: <FontAwesomeIcon icon={faGear} className="w-5 h-5" />, label: "Configuraciones" },
  ];

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    localStorage.setItem('selectedIndex', index.toString());
  };

  const cerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);

      // Limpiar localStorage
      localStorage.removeItem("userId");
      localStorage.removeItem("selectedIndex"); // Limpiar el índice seleccionado al cerrar sesión

      // Redirigir a la página de login
      router.replace('/login');
    } catch (err) {
      console.error('Error al intentar cerrar sesión:', err);
    }
  };

  return (
    <aside className="w-10 sm:w-48 bg-gray-100/40 dark:bg-gray-800/40 flex-shrink-0 mt-7">
      <nav className="flex flex-col gap-2 p-2 sm:p-4">
        {menuItems.map((item, index) => (
          <Button
            onClick={() => handleMenuItemClick(index)} // Cambia aquí
            key={index}
            variant="ghost"
            className={`w-full justify-start hover:bg-[#fe8a5b]/60 transition-transform duration-300 text-medium ${selectedIndex === index ? 'bg-[#fe8a5b] text-white hover:bg-[#fe8a5b]' : ''}`}
          >
            {item.icon}
            <Link href={`/menu/${item.label.toLowerCase()}`}>
              <span className="hidden sm:inline ml-2">{item.label}</span>
            </Link>
          </Button>
        ))}
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-[#fe8a5b]/60 transition-transform duration-300 text-medium"
          onClick={cerrarSesion}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
          <span className="hidden sm:inline ml-2">Cerrar Sesión</span>
        </Button>
      </nav>
    </aside>
  );
}
