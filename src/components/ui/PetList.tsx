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
  return (
    <section className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
      <div>
        {pets.map((pet, index) => {
          //índice para alternar los colores
          const colors = colorPairs[index % colorPairs.length];
          return (
            <PetCard
              key={pet.id}
              id={pet.id}
              nombre={pet.nombre}
              edad={pet.edad}
              ciudad={pet.ciudad}
              imagen={pet.imagen}
              footerBg={colors.footerBg}
              svgBg={colors.svgBg}
            />
          );
        })}
      </div>
    </section>
  );
};

export default PetList;
