'use client';

import React, { useState, useEffect } from "react";
import { fetchUserReports, validateAdminAccess, fetchUserReportsHistorical } from '@/app/administrator/reporte-usuarios/actions';
import ReportModal from '@/components/ui/ReportModal';
import ReportModalHistorical from "@/components/ui/ReportModalHistorical";
import { report } from "process";

const AdminPage = () => {
  const [loadingReports, setLoadingReports] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [isHisorialSelected, setIsHistorialSelected] = useState(false);
  const [reportType, setReportType] = useState('')

  const initPage = async () => {
    try {
      await validateAdminAccess();
      await fetchReports();
    } catch (error) {
      console.error("Error al inicializar la página:", error);
    }
  };

  const fetchReports = async () => {
    console.log(isHisorialSelected, "apa")
    setLoadingReports(true);
    try {
      const data = isHisorialSelected
        ? await fetchUserReportsHistorical()
        : await fetchUserReports();
      console.log("data", data);
      setReports(data || []);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    } finally {
      setLoadingReports(false);
      setReportType(isHisorialSelected ? "historical" : "user")

    }
  };

  useEffect(() => {
    initPage();
  }, []);

  useEffect(() => {
    console.log("ejecutando")
    fetchReports();
  }, [isHisorialSelected]);

  return (
    <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Reporte de usuarios
      </h1>

      <section className="flex justify-center gap-14 border-t-2 border-gray-200 text-sm font-medium">
        <div
          className={`flex items-center gap-2 py-4 cursor-pointer ${!isHisorialSelected ? 'border-t-4 border-orange-500 text-gray-900' : 'text-gray-500'
            }`}
          onClick={() => setIsHistorialSelected(false)}
        >
          <h2>PENDIENTES</h2>
        </div>
        <div
          className={`flex items-center gap-2 py-4 cursor-pointer ${isHisorialSelected ? 'border-t-4 border-orange-500 text-gray-900' : 'text-gray-500'
            }`}
          onClick={() => setIsHistorialSelected(true)}
        >
          <h2>HISTORIAL</h2>
        </div>
      </section>


      {loadingReports ? (
        <div className="flex justify-center items-center mt-10 h-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mt-6">
          {reports.length === 0 ? (
            <p className="text-center text-gray-500">No hay reportes disponibles.</p>
          ) : (
            <ReportList data={reports} type={reportType} />
          )}
        </div>
      )}
    </div>
  );
};

function ReportList({ data, type }: { data: any[]; type: string }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>();

  const handleOnClickReport = (report: any) => {
    setSelectedReport(report);
    setOpenModal(true);
  }

  console.log(type)
  console.log(data, "reportes")

  return (
    <div className="report-list grid grid-cols-2 gap-2 gap-x-4">
      {data.map((report) =>
        type === 'historical' ? (
          <div
            key={`${report.reportado_nombre}-${report.fecha}`}
            className="relative flex items-start bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition hover:cursor-pointer"
            onClick={() => handleOnClickReport(report)}
          >
            {/* Icono */}
            <div className="flex-shrink-0 w-12 h-12 bg-[#b0c5e7] rounded-full flex items-center justify-center text-blue-500 font-bold text-lg">
              📋
            </div>


            {/* Información del reporte */}
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-semibold text-gray-800">
                Reportador:{" "}
                {`${report.reportador_nombre} ${report.reportador_apellido}`}
              </h3>
              <p className="text-sm text-gray-600">
                Reportado:{" "}
                {`${report.reportado_nombre} ${report.reportado_apellido ? report.reportado_apellido : ""}`}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {report.descripcion}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Fecha: {report.fecha}
              </p>
            </div>

            {/* Estado de aprobación */}
            <div
              className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-lg ${report.aprobado
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}
            >
              {report.aprobado ? "Aprobado" : "Denegado"}
            </div>
          </div>
        ) : (
          <div
            key={report.id_reporte_usuario}
            className="relative flex items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
            onClick={() => handleOnClickReport(report)}
          >
            {/* Icono */}
            <div className="flex-shrink-0 w-14 h-14 bg-[#b0c5e7] rounded-full flex items-center justify-center text-white text-2xl">
              📋
            </div>

            {/* Contenido */}
            <div className="ml-4 flex-1">
              {/* Encabezado */}
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-800">
                  {report.reportador
                    ? `${report.reportador.nombre1 || "N/A"} ${report.reportador.apellido1 || "N/A"}`
                    : "Reportador no disponible"}
                </h3>
                <span className="text-xs text-gray-500">{report.fecha}</span>
              </div>

              {/* Subtítulo */}
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Reportado: </span>
                {report.reportado
                  ? `${report.reportado.nombre1 || "N/A"} ${report.reportado.apellido1 || "N/A"}`
                  : "No disponible"}
              </p>

              {/* Descripción */}
              <p className="text-sm text-gray-700 mt-2">{report.descripcion || "Sin descripción"}</p>
            </div>
          </div>

        )
      )}
      {openModal && selectedReport && (type === 'historical' ? (<ReportModalHistorical openFunction={setOpenModal} report={selectedReport} />) : (<ReportModal openFunction={setOpenModal} report={selectedReport} />))}
    </div>
  );
}

export default AdminPage;