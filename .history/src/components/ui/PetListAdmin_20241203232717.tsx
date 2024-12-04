'use client';

import { useEffect, useState } from "react";
import PetCard from "./PetCardAdmin";
import Pet from "@/types/Pet";
import Modal from "./ModalInfo";
import { actualizarConfirmacion } from "@/app/administrator/validaciones/actions";
import { useRouter } from "next/router";

const colorPairs = [
  { footerBg: "#ffe9c2", svgBg: "#ffd68f" },
  { footerBg: "#c7b69f", svgBg: "#7e634e" },
  { footerBg: "#c3c3c3", svgBg: "#9b9b9b" },
  { footerBg: "#fffacd", svgBg: "#caeda1" },
  { footerBg: "#cee8f0", svgBg: "#add8e6" },
];

interface PetListProps {
  pets: Pet[];
  areMyPets?: boolean;
  isInicio?: boolean;
  onDislike?: () => void;
  isLikedP?: boolean;
}

const PetList: React.FC<PetListProps> = ({ pets, areMyPets = false, isInicio = true, onDislike, isLikedP = false }) => {
  const [pet, setPet] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
 
  const handleAccept = async () => {
    
    if (selectedPet?.id_publicacion !== undefined) {
      try {
        await actualizarConfirmacion(selectedPet.id_publicacion, 1);
  
      } catch (error) {
        console.error('Error al actualizar confirmación:', error);
      }
    } else {
      console.error('ID de publicación no encontrado');
    }
    setSelectedPet(null); // Cerrar modal
  };

  const handleReject = async () => {
   
    if (selectedPet?.id_publicacion !== undefined) {
      try {
        await actualizarConfirmacion(selectedPet.id_publicacion, 2);

        console.log('Confirmación actualizada exitosamente');
      } catch (error) {
        console.error('Error al actualizar confirmación:', error);
      }
      console.log("Rechazaste a:", selectedPet?.nombre);
    } else {
      console.error('ID de publicación no encontrado');
    }
    setSelectedPet(null); // Cerrar modal
  };

  useEffect(() => {
    console.log("Pets:", pets);
    setPet(pets);
  }, [pets]);



  return (
    <>
      <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-2">

        {pet && pet.map((pet, index) => {
          const colors = colorPairs[index % colorPairs.length];
          {/*@ts-expect-error */ }
          const ciudad = pet.departamentos ? pet.departamentos.descripcion : "Descripción no disponible";
          return (
            <PetCard
              key={pet.id_publicacion}
              id={pet.id_publicacion}
              nombre={pet.nombre}
              anios={pet.anios}
              meses={pet.meses}
              ciudad={ciudad}
              imagen={pet.imagen}
              footerBg={colors.footerBg}
              svgBg={colors.svgBg}
              isMyPet={areMyPets}
              //@ts-expect-error
              disponible={pet.estado_adopcion}
              isInicio={isInicio}
              onDislike={onDislike}
              isLikedP={isLikedP}
              onClick={() => setSelectedPet(pet)}
            />
          );
        })}

      </section>
      {selectedPet && (
        <Modal
          isOpen={!!selectedPet}
          onClose={() => setSelectedPet(null)}
          onAccept={handleAccept}
          onReject={handleReject}
          id={selectedPet.id_publicacion}
        />
      )}
    </>
  );
};

export default PetList;


