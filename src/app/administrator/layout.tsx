import { validateGeneralAccess } from './actions';
import { redirect } from 'next/navigation';

export default async function AdministratorLayout({ children }: { children: React.ReactNode }) {
  const access = await validateGeneralAccess();

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

  return (
    <div>
      <h1>Panel de Administración ({access.role})</h1>
      <div>{children}</div>
    </div>
  );
}
