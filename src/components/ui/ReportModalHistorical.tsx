import { useState, useEffect, useRef } from "react";

export default function ReportModalHistorical({
  openFunction,
  report
}: {
  openFunction: (isOpen: boolean) => void;
  report: any;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null); // Ref para el contenedor del modal

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      openFunction(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
<div className="relative flex justify-center">
  {isOpen && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-900 overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={() => openFunction(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          ✕
        </button>
        <div className="mt-2 text-center">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            REPORTE {report.id_reporte}

          </h3>
        </div>
                {/* Estado del Reporte */}
                <div className=" text-center">
          <p
            className={`mt-2 px-3 py-1 inline-block rounded-full text-sm font-medium ${
              report.aprobado
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {report.aprobado ? "Aceptado" : "Denegado"}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2 text-base">
            <strong>Motivo:</strong> {report.comentario}
          </p>
        </div>

        {/* moderador */}
        <div className="rounded-lg p-6 bg-red-50 dark:bg-gray-800 mt-4 bg-[#00a7775c]">
          <h4 className="text-md font-semibold text-gray-800 dark:text-white">
            Moderador a cargo
          </h4>
          <div className="text-sm flex items-center gap-4 mt-3">
            {report.moderador_imagen && (
              <img
                src={report.moderador_imagen}
                alt="Reportado"
                className="w-14 h-14 rounded-full shadow-md"
              />
            )}
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Nombre:</strong> {report.moderador}{" "}
                {report.moderador_apellido}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Correo:</strong> {report.moderador_correo}
              </p>
            </div>
          </div>
        </div>

        {/* Usuario Reportado */}
        <div className="rounded-lg p-6 bg-red-50 dark:bg-gray-800 mt-4 bg-[#a700005c]">
          <h4 className="text-md font-semibold text-gray-800 dark:text-white">
            Usuario Reportado
          </h4>
          <div className="text-sm flex items-center gap-4 mt-3">
            {report.reportado_imagen && (
              <img
                src={report.reportado_imagen}
                alt="Reportado"
                className="w-14 h-14 rounded-full shadow-md"
              />
            )}
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Nombre:</strong> {report.reportado_nombre}{" "}
                {report.reportado_apellido}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Correo:</strong> {report.reportado_correo}
              </p>
            </div>
          </div>
        </div>

        {/* Descripción del Reporte */}
        <div className="rounded-lg p-6 bg-gray-50 dark:bg-gray-900 shadow-md mt-3">
          <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
            Descripción del Reporte
          </h4>
          <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">
            {report.descripcion}
          </p>
          <div className="mt-6 flex justify-end items-center">
            <div className="flex flex-col items-end text-right gap-2">
              <div>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {report.reportador_nombre} {report.reportador_apellido}
                </p>
                <p className="text-gray-400 dark:text-gray-300 text-xs">
                  {report.reportador_correo}
                </p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-400">
                <em>Fecha:</em> {report.fecha}
              </span>
            </div>
            {report.reportador_imagen && (
              <img
                src={report.reportador_imagen}
                alt="Reportador"
                className="w-12 h-12 rounded-full shadow-md ml-4"
              />
            )}
          </div>
        </div>

        {/* Evidencias */}
        <div className="mt-3 px-6 py-4">
          <h4 className="text-md font-semibold text-gray-800 mb-4 dark:text-white">
            Evidencias
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {report.imagenes
              .filter((img) => img !== null)
              .map((img: string, index: number) => (
                <div
                  key={index}
                  className={`flex justify-center ${
                    report.imagenes.length === 1
                      ? "justify-center"
                      : "justify-start"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Evidencia ${index + 1}`}
                    className="object-cover w-full h-32 md:h-48 lg:h-64 rounded-lg shadow-md cursor-pointer border border-gray-300"
                    onClick={() => setSelectedImage(img)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )}

  {selectedImage && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={() => setSelectedImage(null)}
    >
      <img
        src={selectedImage}
        alt="Evidencia ampliada"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  )}
</div>



    </>
  );
}
