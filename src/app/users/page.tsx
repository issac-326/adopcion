// src/app/users/page.tsx

import { createClient } from '@/utils/supabase/server';

export default async function UsersPage() {
  const supabase = createClient();

  // Obtén los usuarios del esquema auth
  const { data, error } = await supabase
    .from('users') // Asegúrate de usar el esquema auth
    .select('*');

  if (error) {
    console.error('Error fetching auth users:', error);
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Authenticated Users</h1>
      {data.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {data.map((user: any) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
