'use client';

import React, { useState, useEffect } from 'react';
import { fetchSupportReports, approveReport, denegateReport } from './action';
import { ToastContainer, toast } from 'react-toastify';


const AdminPage = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const getReports = async () => {
      const fetchedReports = await fetchSupportReports();
      const eliminatedReports = JSON.parse(localStorage.getItem('eliminatedReports') || '[]');
  
      const filteredReports = fetchedReports.filter(
        (report: any) => !eliminatedReports.includes(report.id_reporte_soporte)
      );
  
      // Ordena los reportes por fecha en orden descendente
      const sortedReports = filteredReports.sort((a, b) => {
        const dateA = new Date(a.fecha_reporte);
        const dateB = new Date(b.fecha_reporte);
        return dateB - dateA; // Orden descendente
      });
  
      setReports(sortedReports);
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

  const removeReportFromUI = (id: number) => {
    const eliminatedReports = JSON.parse(localStorage.getItem('eliminatedReports') || '[]');
    localStorage.setItem('eliminatedReports', JSON.stringify([...eliminatedReports, id]));
    setReports((prevReports) => prevReports.filter(report => report.id_reporte_soporte !== id));
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
              <div className="flex-shrink-0 w-12 h-12 bg-[#b0c5e7] rounded-full flex items-center justify-center text-blue-500 font-bold text-lg">
                📋
              </div>

              <div className="ml-4 flex-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  Reportador: {report.usuario?.nombre1} {report.usuario?.apellido1}
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
        <ReportModal
          report={selectedReport}
          onClose={handleCloseModal}
          removeReportFromUI={removeReportFromUI}
        />
      )}

      <ToastContainer />
    </div>
  );
};

function ReportModal({ report, onClose, removeReportFromUI }: { report: any; onClose: () => void; removeReportFromUI: (id: number) => void }) {
  const handleApprove = async () => {
    if (!report?.id_reporte_soporte) {
      toast.error('ID del reporte invalido');
      return;
    }

    const result = await approveReport(report.id_reporte_soporte);
    if (result.success) {
      toast.success('Reporte aprobado');
      removeReportFromUI(report.id_reporte_soporte);
      onClose();
    } else {
      toast.error('Error al aprobar el reporte');
    }
  };

  const handleDenegar = async () => {
    const result = await denegateReport(report.id_reporte_soporte);
  
    if (result.success) {
      // Notificación en rojo al denegar
      toast.error('Reporte denegado');
      removeReportFromUI(report.id_reporte_soporte);
      onClose();
    } else {
      toast.error(`Error al denegar el reporte: ${result.error}`);
    }
  };
  

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">Detalles del Reporte</h2>

        <p>
          <strong>Usuario:</strong> {report.usuario?.nombre1} {report.usuario?.apellido1}
        </p>
        <p>
          <strong>Correo:</strong> {report.usuario?.correo || 'No disponible'}
        </p>
        <p>
          <strong>Descripción:</strong> {report.descripcion || 'No disponible'}
        </p>
        <p>
          <strong>Fecha:</strong> {report.fecha_reporte || 'No disponible'}
        </p>

        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={handleDenegar}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 transition"
          >
            Denegar
          </button>

          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition"
          >
            Aprobar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
