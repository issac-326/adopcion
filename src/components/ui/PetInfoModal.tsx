import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const MovableModal = ({ mascota, onClose }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    modalRef.current.startX = e.clientX - position.x;
    modalRef.current.startY = e.clientY - position.y;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - modalRef.current.startX,
      y: e.clientY - modalRef.current.startY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-[9999] pointer-events-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={modalRef}
        className="absolute bg-white shadow-2xl rounded-lg w-[90%] md:w-[20%] h-auto pointer-events-auto cursor-grab border border-gray-200 overflow-hidden"
        style={{ top: position.y, left: position.x }}
        onMouseDown={handleMouseDown}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition z-10"
        >
          <FontAwesomeIcon icon={faTimes as IconProp} size="lg" />
        </button>

        {/* Imagen */}
        <div className="relative w-full h-48 select-none">
          <Image
            src={mascota.imagen}
            alt="Mascota"
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg pointer-events-none"
          />
        </div>

        {/* Contenido */}
        <div className="p-4 select-none">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
            {mascota.nombre}
          </h2>
          <p className="text-gray-700 text-sm text-center">
            <strong>Edad:</strong> {mascota.edad}
          </p>
          <p className="text-gray-700 text-sm text-center">
            <strong>Sexo:</strong> {mascota.sexo ? 'Macho' : 'Hembra'}
          </p>
          <p className="text-gray-700 text-sm text-center mt-2">
            {mascota.descripcion}
          </p>
        </div>
      </div>
    </div>
  );
};

const App = ({ mascota }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="absolute bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="absolute bg-gray-100 flex justify-center items-center z-50">
        {isModalOpen && <MovableModal mascota={mascota} onClose={closeModal} />}
      </div>
    </div>
  );
};

export default App;
