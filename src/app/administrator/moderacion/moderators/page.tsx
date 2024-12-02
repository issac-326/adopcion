'use client';

import React, { useState, useEffect } from 'react';
import { fetchModerators } from './actions';

const ModeratorsPage = () => {
  const [moderators, setModerators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAndSetModerators = async () => {
    setIsLoading(true);
    try {
      const data = await fetchModerators();
      setModerators(data || []);
    } catch (error) {
      console.error('Error al cargar moderadores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetModerators();
  }, []);

  return (
    <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Lista de Moderadores
      </h1>

      {isLoading ? (
        <div className="flex justify-center mt-10">
          <p className="text-gray-500 text-lg">Cargando moderadores...</p>
        </div>
      ) : (
        <div className="mt-6">
          {moderators.length === 0 ? (
            <p className="text-center text-gray-500">No hay moderadores registrados.</p>
          ) : (
            <ModeratorsList data={moderators} />
          )}
        </div>
      )}
    </div>
  );
};

function ModeratorsList({ data }: { data: any[] }) {
  return (
    <div className="moderators-list space-y-4">
      {data.map((moderator) => (
        <div
          key={moderator.id_usuario}
          className="relative flex items-start bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition"
        >
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500 font-bold text-lg">
            🧑‍⚖️
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-semibold text-gray-800">
              {moderator.nombre1} {moderator.apellido1}
            </h3>
            <p className="text-sm text-gray-600">Correo: {moderator.correo}</p>
            <p className="text-sm text-gray-600">Teléfono: {moderator.telefono || 'No registrado'}</p>
            <p className="text-xs text-gray-400">Registrado el: {moderator.fecha_creacion}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ModeratorsPage;
