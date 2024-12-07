'use client';

import React, { useState, useEffect } from 'react';
import { fetchSupportReports } from './action';  // Si el archivo action.js está en la misma carpeta
// Ajusta la ruta a donde está tu archivo

const AdminPage = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // Obtener los reportes cuando el componente se monta
  useEffect(() => {
    const getReports = async () => {
      const fetchedReports = await fetchSupportReports();
      setReports(fetchedReports);
    };
    getReports();
  }, []);

  const handleOnClickReport = (report: any) => {
    setSelectedReport(report);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedReport(null);
  };

  return (
    <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Panel de Administración
      </h1>

      <div className="report-list grid grid-cols-2 gap-2 gap-x-4">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id_reporte_soporte}
              className="relative flex items-start bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition hover:scale-[1.02] cursor-pointer"
              onClick={() => handleOnClickReport(report)}
            >
              {/* Icono */}
              <div className="flex-shrink-0 w-12 h-12 bg-[#b0c5e7] rounded-full flex items-center justify-center text-blue-500 font-bold text-lg">
                📋
              </div>

              {/* Información del reporte */}
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  Reportador: {`${report.usuario.nombre1} ${report.usuario.apellido1}`}
                </h3>
                <p className="text-sm text-gray-600">
                  Descripción: {report.descripcion}
                </p>
                <p className="text-xs text-gray-400 mt-1">Fecha: {report.fecha_reporte}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay reportes disponibles.</p>
        )}
      </div>

      {openModal && selectedReport && (
        <ReportModal report={selectedReport} onClose={handleCloseModal} />
      )}
    </div>
  );
};

function ReportModal({ report, onClose }: { report: any; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">Detalles del Reporte</h2>
        <p>
          <strong>Usuario:</strong> {`${report.usuario.nombre1} ${report.usuario.apellido1}`}
        </p>
        <p>
          <strong>Correo:</strong> {report.usuario.correo}
        </p>
        <p>
          <strong>Descripción:</strong> {report.descripcion || 'No disponible'}
        </p>
        <p>
          <strong>Fecha:</strong> {report.fecha_reporte || 'No disponible'}
        </p>
      </div>
    </div>
  );
}

export default AdminPage;
