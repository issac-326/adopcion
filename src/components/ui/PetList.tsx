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
    
    setPet(pets);
  }, [pets]);



  return (
    <section className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
      
        {pet &&pet.map((pet, index) => {
          const colors = colorPairs[index % colorPairs.length];
          return (
            <PetCard
              key={pet.id_publicacion}
              id={pet.id_publicacion}
              nombre={pet.nombre}
              edad={pet.edad}
              ciudad={pet.ciudad}
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
