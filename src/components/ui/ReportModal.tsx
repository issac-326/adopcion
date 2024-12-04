import { useState, useEffect, useRef } from "react";
import { approveReport, denegateReport } from "@/app/admin/actions";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ReportModal({
  openFunction,
  report
}: {
  openFunction: (isOpen: boolean) => void;
  report: any;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "deny" | null>(null);
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


  // Hacer scroll hacia abajo cuando se muestre el input de razón
  useEffect(() => {
    if (showReasonInput && modalRef.current) {
      modalRef.current.scrollTop = modalRef.current.scrollHeight; // Hace scroll hacia el final
    }
  }, [showReasonInput]);

  async function aprobarHandler(
    idUserReported: number,
    idReporte: number,
    correo: string,
    reason: string
  ): Promise<void> {
    if (!reason) {
      toast.error("La razón es obligatoria");
      return;
    }
    try {
      await approveReport(idUserReported, idReporte, correo, reason);
      toast.success("Reporte aprobado exitosamente");
      openFunction(false);
    } catch (error) {
      console.error("Error approving the report:", error);
      toast.error("Ocurrió un error");
    }
  }

  async function denegarHandler(
    idUserReported: number,
    correo: string,
    reason: string
  ): Promise<void> {
    if (!reason) {
      toast.error("La razón es obligatoria");
      return;
    }
    try {
      await denegateReport(idUserReported, correo, reason);
      toast.success("Reporte denegado exitosamente");
      openFunction(false);
    } catch (error) {
      console.error("Error denying the report:", error);
      toast.error("Ocurrió un error");
    }
  }

  const handleAction = (action: "approve" | "deny") => {
    setActionType(action);
    setShowReasonInput(true);
  };

  const handleSubmit = () => {
    if (actionType === "approve") {
      aprobarHandler(
        report.reportado.id_usuario,
        report.id_reporte_usuario,
        report.reportador.correo,
        reason
      );
    } else if (actionType === "deny") {
      denegarHandler(
        report.id_reporte_usuario,
        report.reportado.correo,
        reason
      );
    }
  };
  console.log(report);

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
                  REPORTE
                  {/*                                     ID del reporte: {report.id_reporte_usuario}
                   */}{" "}
                </h3>
              </div>

              <div className="flex ml-auto flex-col mt-5 space-y-4">
                <div className="rounded-lg p-6 bg-red-50 dark:bg-gray-800">
                  <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                    Usuario Reportado
                  </h4>
                  <div className="text-sm flex items-center gap-4 mt-3">
                    <img
                      src={report.reportado.imagen}
                      alt="Reportado"
                      className="w-14 h-14 rounded-full shadow-md"
                    />
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Nombre:</strong> {report.reportado.nombre1}{" "}
                        {report.reportado.apellido1}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Correo:</strong> {report.reportado.correo}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg p-6 bg-gray-50 dark:bg-gray-900 shadow-md mt-6">
                  <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
                    Descripción del Reporte
                  </h4>
                  <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">
                    {report.descripcion}

                  </p>
                  <div className="mt-6 flex justify-end items-center">
                    {/* Usuario Emisor */}
                    <div className="flex flex-col items-end text-right gap-2">
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          {report.reportador.nombre1}{" "}
                          {report.reportador.apellido1}
                        </p>
                        <p className="text-gray-400 dark:text-gray-300 text-xs">
                          {report.reportador.correo}
                        </p>
                      </div>
                      {/* Fecha */}
                      <span className="text-xs text-gray-400 dark:text-gray-400">
                        <em>Fecha:</em> {report.fecha}
                      </span>
                    </div>
                    <img
                      src={report.reportador.imagen}
                      alt="Reportador"
                      className="w-12 h-12 rounded-full shadow-md ml-4"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 px-6 py-4 border-gray border-t-1">
                <h4 className="text-md font-semibold text-gray-800 mb-4 dark:text-white">
                  Evidencias
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {report.imagenes.map((img: string, index: number) => (
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

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => handleAction("deny")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-[#e4e6eb] border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Denegar
                </button>
                <button
                  onClick={() => handleAction("approve")}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#fe8a5b] rounded-md hover:bg-orange-500 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  Aprobar
                </button>
              </div>

              {showReasonInput && (
                <div className="mt-6">
                  <label
                    htmlFor="reason"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Razón:
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-2 w-full w-5 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-100"
                    rows={4}
                    placeholder="Escribe la razón..."
                  />
                  <div className="mt-4 flex">
                    <button
                      onClick={handleSubmit}
                      className={`px-4 py-2 text-sm font-mediumflex-end  rounded-md ml-auto focus:outline-none focus:ring ${
                        actionType === "approve"
                          ? "text-white bg-[#58f558] hover:bg-orange focus:ring-green-300"
                          : "text-white bg-[#f5a2a4] hover:bg-red-500 focus:ring-red-300"
                      }`}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
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
