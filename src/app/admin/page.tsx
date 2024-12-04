'use client';

import React, { useState, useEffect } from "react";
import { fetchSupportReports, fetchUserReports, validateAdminAccess } from './actions';
import ReportModal from '@/components/ui/ReportModal';

const AdminPage = () => {
  const [isSupportSelected, setIsSupportSelected] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  const initPage = async () => {
    try {
      await validateAdminAccess();
      await fetchReports();
    } catch (error) {
      console.error("Error al inicializar la página:", error);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const data = isSupportSelected
        ? await fetchSupportReports()
        : await fetchUserReports();
      setReports(data || []);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    initPage();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [isSupportSelected]);

  return (
    <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Panel de Administración
      </h1>

      <section className="flex justify-center gap-14 border-t-2 border-gray-200 text-sm font-medium">
        <div
          className={`flex items-center gap-2 py-4 cursor-pointer ${
            isSupportSelected ? 'border-t-4 border-orange-500 text-gray-900' : 'text-gray-500'
          }`}
          onClick={() => setIsSupportSelected(true)}
        >
          <h2>REPORTES DE SOPORTE</h2>
        </div>
        <div
          className={`flex items-center gap-2 py-4 cursor-pointer ${
            !isSupportSelected ? 'border-t-4 border-orange-500 text-gray-900' : 'text-gray-500'
          }`}
          onClick={() => setIsSupportSelected(false)}
        >
          <h2>REPORTES DE USUARIOS</h2>
        </div>
      </section>


      {loadingReports ? (
        <div className="flex justify-center mt-10">
          <p className="text-gray-500 text-lg">Cargando reportes...</p>
        </div>
      ) : (
        <div className="mt-6">
          {reports.length === 0 ? (
            <p className="text-center text-gray-500">No hay reportes disponibles.</p>
          ) : (
            <ReportList data={reports} type={isSupportSelected ? "support" : "user"} />
          )}
        </div>
      )}
    </div>
  );
};

function ReportList({ data, type }: { data: any[]; type: string }) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedReport, setSelectedReport] =  useState<any>();

    const handleOnClickReport = (report : any) => {
        setSelectedReport(report);
        setOpenModal(true);
    }



  return (
    <div className="report-list space-y-4">
      {data.map((report) =>
        type === 'support' ? (
          <div
            key={report.id_reporte_soporte}
            className="relative flex items-start bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition hover:cursor-pointer"
            onClick={() => handleOnClickReport(report)}
          >
            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold text-lg">
              🛠️
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Usuario:{" "}
                {report.usuario
                  ? `${report.usuario.nombre1 || "N/A"} ${report.usuario.apellido1 || "N/A"}`
                  : "Usuario no encontrado"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {report.descripcion}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Fecha: {report.fecha_reporte}
              </p>
            </div>
          </div>
        ) : (
          <div
            key={report.id_reporte_usuario}
            className="relative flex items-start bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition hover:cursor-pointer"
            onClick={() => handleOnClickReport(report)}
          >
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold text-lg">
              📋
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Reportador:{" "}
                {report.reportador
                  ? `${report.reportador.nombre1 || "N/A"} ${report.reportador.apellido1 || "N/A"}`
                  : "No disponible"}
              </h3>
              <p className="text-sm text-gray-600">
                Reportado:{" "}
                {report.reportado
                  ? `${report.reportado.nombre1 || "N/A"} ${report.reportado.apellido1 || "N/A"}`
                  : "No disponible"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {report.descripcion}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Fecha: {report.fecha}
              </p>
            </div>
          </div>
        )
      )}
      {openModal && selectedReport && (<ReportModal openFunction={setOpenModal} report={selectedReport} />)}
    </div>
  );
}

export default AdminPage;