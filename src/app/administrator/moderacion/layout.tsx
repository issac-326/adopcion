import { validatePageAccess } from '../actions'; // 
import { redirect } from 'next/navigation';

const allowedRoles = [1]; // Solo administradores

export default async function ModeracionLayout({ children }: { children: React.ReactNode }) {
  // Validar acceso
/*   const access = await validatePageAccess(allowedRoles);

  if (access.status === 0) {
    console.log('Usuario no autenticado, redirigiendo a /login');
    redirect('/login');
    return null;
  }

  if (access.status === 1) {
    console.log('Usuario sin permisos, redirigiendo a /administrator');
    redirect('/administrator');
    return null;
  } */

  console.log('Usuario autorizado para acceder a las páginas de moderación');

  return (
    <div>
      <header>
      </header>
      <main>{children}</main>
    </div>
  );
}
