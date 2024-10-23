import { useEffect, useState } from "react";
import PetCard from "./PetCard";
import Pet from "@/types/Pet";

const colorPairs = [
  { footerBg: "#ffe9c2", svgBg: "#ffd68f" },
  { footerBg: "#c7b69f", svgBg: "#7e634e" },
  { footerBg: "#c3c3c3", svgBg: "#9b9b9b" },
  { footerBg: "#fffacd", svgBg: "#caeda1" },
  { footerBg: "#cee8f0", svgBg: "#add8e6" },
];

const PetList = ({ pets }: { pets: Pet[] }) => {
  const [pet, setPet] = useState<Pet[]>([]);

  useEffect(() => {
    console.log("Pets:", pets);
    setPet(pets);
  }, [pets]);



  return (
    <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-2">
      
        {pet &&pet.map((pet, index) => {
          const colors = colorPairs[index % colorPairs.length];
          const ciudad = pet.departamentos ? pet.departamentos.descripcion : "Descripción no disponible";
          return (
            <PetCard
              key={pet.id_publicacion}
              id={pet.id_publicacion}
              nombre={pet.nombre}
              edad={pet.edad}
              ciudad={ciudad}
              imagen={pet.imagen}
              footerBg={colors.footerBg}
              svgBg={colors.svgBg}
            />
          );
        })}
      
    </section>
  );
};

export default PetList;
