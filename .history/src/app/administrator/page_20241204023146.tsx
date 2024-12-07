
import Image from 'next/image'
export default function AdministratorDashboard() {
    return (
      <div>
       <div className="w-full min-h-screen bg-gradient-to-br from-[#f39893] to-[#f5a473] flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full space-y-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-48 h-48">
            <Image
              src="/img/logos/mensajeria.png"
              alt="Logo de PetFinder"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-[#5a617c] text-center">
            Bienvenido
          </h1>
          <p className="text-center text-lg text-[#7d86a5] font-medium max-w-md">
            Gracias por tu dedicación en conectar a las personas con sus compañeros de vida perfectos.
          </p>
        </div>
      </div>
    </div>
      </div>
    );
  }
  