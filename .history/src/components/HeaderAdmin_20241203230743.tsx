'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button'; 
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient'; 
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface MenuItem {
  icon: JSX.Element;
  label: string;
  slug : string;
}

export default function Header({ menuItems }: { menuItems: MenuItem[] }) {
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

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    localStorage.setItem('selectedIndex', index.toString());
  };

  const cerrarSesion = async () => {
    try {
      // Llamamos al endpoint para borrar la cookie en el servidor
      const response = await fetch('/api/auth', {
        method: 'POST',
      });
  
      if (!response.ok) {
        throw new Error('No se pudo cerrar sesión');
      }
  
      // Limpiar localStorage en caso de que guardes otros datos
      localStorage.removeItem("selectedIndex");
  
      // Redirigir a la página de login
      router.replace('/login');
    } catch (err) {
      console.error('Error al intentar cerrar sesión:', err);
    }
  };

  return (
<aside className="w-10 sm:w-64 bg-gray-100/40 dark:bg-gray-800/40 flex-shrink-0 mt-7">
  <nav className="flex flex-col gap-2 p-2 sm:p-4">
    {menuItems.map((item, index) => (
      <Button
        onClick={() => handleMenuItemClick(index)}
        key={index}
        variant="ghost"
        className={`w-full justify-start hover:bg-[#fe8a5b]/70 transition-transform duration-300 text-medium break-words ${selectedIndex === index ? 'bg-[#fe8a5b] text-white hover:bg-[#fe8a5b]' : ''}`}
      >
        {item.icon}
        <Link href={`/administrator/${item.slug}`}>
          <span className="hidden sm:inline ml-2 break-words text-left">{item.label}</span>
        </Link>
      </Button>
    ))}
    <Button
      variant="ghost"
      className="w-full justify-start hover:bg-[#fe8a5b]/60 transition-transform duration-300 text-medium break-words"
      onClick={cerrarSesion}
    >
      <FontAwesomeIcon icon={faSignOutAlt as IconProp} className="w-5 h-5" />
      <span className="hidden sm:inline ml-2 break-words text-left">Cerrar Sesión</span>
    </Button>
  </nav>
</aside>

  );
}
