import Header from '@/components/HeaderAdmin';
import { validateGeneralAccess } from './actions';
import { redirect } from 'next/navigation';
import { faUser, faHeart, faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { faBug, faGear, faPlus, faSignOutAlt, faUserShield, faListCheck,faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface MenuItem {
  icon: JSX.Element;
  label: string;
  slug : string;
}

export default async function AdministratorLayout({ children }: { children: React.ReactNode }) {
/*   const access = await validateGeneralAccess();

  if (access.status === 0) {
    console.log('Usuario no autenticado, redirigiendo a /login');
    redirect('/login');
    return null;
  }

  if (access.status === 1) {
    console.log('Usuario sin acceso a /administrator, redirigiendo a /menu/inicio');
    redirect('/menu/inicio');
    return null;
  }

  console.log(`Usuario autorizado para /administrator con rol: ${access.role}`);
 */
  const menuItems: MenuItem[] = [
    { icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M180-475q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180-160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm240 0q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180 160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM266-75q-45 0-75.5-34.5T160-191q0-52 35.5-91t70.5-77q29-31 50-67.5t50-68.5q22-26 51-43t63-17q34 0 63 16t51 42q28 32 49.5 69t50.5 69q35 38 70.5 77t35.5 91q0 47-30.5 81.5T694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z" /></svg>, label: "Inicio", slug: "" },
    { icon: <FontAwesomeIcon icon={faListCheck as IconProp} className="w-5 h-5" />, label: "Validar Mascotas" , slug: "/validaciones" },
    { icon: <FontAwesomeIcon icon={faUserShield as IconProp} className='w-5 h-5'/>, label: "Reportes de usuarios", slug: "/reporte-usuarios" },
/*     ...(access.role === 'admin'
      ? [{
          icon: <FontAwesomeIcon icon={faUser as IconProp} className="w-5 h-5" />, 
          label: "Gestión de moderadores", 
          slug: "/moderacion"
        },
        {
          icon: <FontAwesomeIcon icon={faUsersRectangle as IconProp} className="w-5 h-5" />, 
          label: "Gestión de moderadores", 
          slug: "/moderacion/moderators"
        },
       ]
      : []
    ), */
    { icon: <FontAwesomeIcon icon={faBug as IconProp} className="w-5 h-5" />, label: "Log de soporte" , slug: "/reporteSoporte"},
   
  ];
/*
validar una mascota 
reporte usuario 
reporte soporte 
gestion de moderadores
*/
  return (
    <div className="flex h-screen">
      <Header menuItems={menuItems} />
      <main className="flex-1 overflow-auto w-full ">
        <div className=" relative bg-white border mt-2 mb-4  mx-4 min-h-screen rounded-xl shadow-[0_3px_6px_rgba(0,0,0,0.15),0_8px_16px_rgba(0,0,0,0.1),0_20px_30px_rgba(0,0,0,0.05)]
">

          {children}

        </div>
      </main>
    </div>
  );
}
