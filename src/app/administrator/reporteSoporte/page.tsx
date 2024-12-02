import { validatePageAccess } from '../actions';
import { redirect } from 'next/navigation';

const allowedRoles = [1,3]; // Solo admins

export default async function ManageUsers() {
  const access = await validatePageAccess(allowedRoles);

  if (access.status === 0) {
    console.log('Usuario no autenticado, redirigiendo a /login');
    redirect('/login');
    return null;
  }

  if (access.status === 1) {
    console.log('Usuario sin permisos para esta página, redirigiendo a /administrator');
    redirect('/administrator');
    return null;
  }

  console.log('Usuario autorizado para acceder a esta página');
  return (
    <div>
      <h2>Gestión de Reportes para soporte </h2>
      <p>Aquí puedes gestionar reportes los usuarios del sistema a soporte tecnico .</p>
    </div>
  );
}
