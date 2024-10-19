
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { faGear, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button'; // Asegúrate de que Button esté definido
import Link from 'next/link';

interface MenuItem {
  icon: JSX.Element;
  label: string;
}

export default function Header() {
  const menuItems: MenuItem[] = [
    { icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M180-475q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180-160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm240 0q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180 160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM266-75q-45 0-75.5-34.5T160-191q0-52 35.5-91t70.5-77q29-31 50-67.5t50-68.5q22-26 51-43t63-17q34 0 63 16t51 42q28 32 49.5 69t50.5 69q35 38 70.5 77t35.5 91q0 47-30.5 81.5T694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z"/></svg>, label: "Inicio" },
    { icon: <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />, label: "Favoritos" },
    { icon: <FontAwesomeIcon icon={faCommentDots} className="w-5 h-5" />, label: "Mensaje" },
    { icon: <FontAwesomeIcon icon={faUser} className="w-5 h-5" />, label: "Perfil" },
    { icon: <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />, label: "Publicar" },
    { icon: <FontAwesomeIcon icon={faGear} className="w-5 h-5" />, label: "Configuración" },
  ];

  return (
    <aside className="w-16 sm:w-64 bg-gray-100/40 dark:bg-gray-800/40 flex-shrink-0 mt-7">
      <nav className="flex flex-col gap-2 p-2 sm:p-4">
        {menuItems.map((item, index) => (
          <Button key={index} variant="ghost" className="w-full justify-start hover:scale-110 hover:bg-[#e8defd] transition-transform duration-300 text-lg">
            {item.icon}
            <Link href={`/menu/${item.label.toLowerCase()}`}>
              <span className="hidden sm:inline ml-2">{item.label}</span>
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
);
}