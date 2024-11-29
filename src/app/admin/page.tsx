import { validateAdminAccess } from './actions';
export default async function AdminPage() {
  // Valida si el usuario tiene acceso de administrador
  await validateAdminAccess();
  // Renderiza la página del administrador
  return (
    <div>
      <h1>Panel de Administración</h1>
      <p>Bienvenido al área de administración. Solo los administradores pueden acceder.</p>
    </div>
  );
}