import { redirect } from 'next/navigation';

export default function Home() {
  // Realiza la redirección
  redirect('/Landing');

  // No renderiza nada porque redirige automáticamente
  return null;
}
