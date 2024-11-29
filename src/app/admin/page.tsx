'use client';

import React, { useState, useEffect } from "react";
import { fetchSupportReports, fetchUserReports, validateAdminAccess } from './actions';

const AdminPage = () => {
  const [isSupportSelected, setIsSupportSelected] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  /**
   * Valida el acceso del administrador y carga los reportes iniciales.
   */
  const initPage = async () => {
    try {
      await validateAdminAccess();
      await fetchReports();
    } catch (error) {
      console.error("Error al inicializar la página:", error);
    }
  };

  /**
   * Carga los reportes según la pestaña seleccionada.
   */
  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const data = isSupportSelected
        ? await fetchSupportReports()
        : await fetchUserReports();
      console.log("Datos cargados en fetchReports:", data);  
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
    <div className="admin-dashboard mx-4 my-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Panel de Administración</h1>

      <section className="flex justify-center gap-14 border-t-1 text-xs text-gray-600 font-medium">
        <div
          className={`box-border flex items-center gap-2 py-4 hover:cursor-pointer ${isSupportSelected ? 'border-t border-orange-400 text-black' : ''}`}
          onClick={() => setIsSupportSelected(true)}
        >
          <h2>REPORTES DE SOPORTE</h2>
        </div>
        <div
          className={`flex items-center gap-2 py-4 hover:cursor-pointer ${!isSupportSelected ? 'border-t border-orange-400 font-semibold text-black' : ''}`}
          onClick={() => setIsSupportSelected(false)}
        >
          <h2>REPORTES DE USUARIOS</h2>
        </div>
      </section>

      {loadingReports ? (
        <p className="text-gray-600 text-center">Cargando reportes...</p>
      ) : (
        <div className="mt-4">
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
  return (
    <div className="report-list">
      <ul>
        {data.map((report) =>
          type === 'support' ? (
            <li key={report.id_reporte_soporte} className="mb-4 border-b pb-2">
              <strong>Usuario:</strong>{" "}
              {report.usuario
                ? `${report.usuario.nombre1 || "N/A"} ${report.usuario.apellido1 || "N/A"}`
                : "Usuario no encontrado"}
              <br />
              <strong>Descripción:</strong> {report.descripcion} <br />
              <strong>Fecha:</strong> {report.fecha_reporte}
            </li>
          ) : (
            <li key={report.id_reporte_usuario} className="mb-4 border-b pb-2">
              <strong>Reportador:</strong>{" "}
              {report.reportador
                ? `${report.reportador.nombre1 || "N/A"} ${report.reportador.apellido1 || "N/A"}`
                : "No disponible"}
              <br />
              <strong>Reportado:</strong>{" "}
              {report.reportado
                ? `${report.reportado.nombre1 || "N/A"} ${report.reportado.apellido1 || "N/A"}`
                : "No disponible"}
              <br />
              <strong>Descripción:</strong> {report.descripcion} <br />
              <strong>Fecha:</strong> {report.fecha}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default AdminPage;
