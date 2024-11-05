const PetInformationSkeleton = ({ isMyPet = false }: { isMyPet?: boolean }) => {
    return (
        <div className="bg-white min-h-screen flex flex-col lg:flex-row-reverse p-5 animate-pulse">
            {/* Imagen de la mascota */}
            <div className="flex-1 flex justify-center items-center rounded-br-[50px] mt-8 lg:mt-0">
                <div className="bg-gray-200 rounded-lg sm:w-[200px] sm:h-[200px] lg:w-[500px] lg:h-[500px] shadow-md"></div>
            </div>

            {/* Información */}
            <div className="flex-1 flex flex-col justify-between p-8">
                {/* Botón para regresar */}
                <div className="rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center cursor-not-allowed">
                    <div className="bg-gray-200 w-8 h-8 rounded-full"></div>
                </div>

                <div className="flex-1 p-8 pt-2 flex flex-col">
                    {/* Nombre y ubicación */}
                    <div className="flex justify-between items-center">
                        <div className="p-3 flex-1">
                            <div className="bg-gray-200 h-6 w-2/3 rounded mb-2"></div>
                            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                        </div>
                        {!isMyPet && (<div className="bg-gray-200 w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full cursor-not-allowed"></div>)}
                        
                    </div>

                    {/* Descripción y detalles */}
                    <div className="flex flex-col lg:flex-row justify-between mt-8">
                        <div className="flex-1 bg-gray-200 p-3 rounded-lg mr-4 mb-4 lg:mb-0">
                            <div className="bg-gray-200 h-4 w-1/2 rounded mb-1"></div>
                            <div className="bg-gray-200 h-3 w-1/3 rounded"></div>
                        </div>
                        <div className="flex-1 bg-gray-200 p-3 rounded-lg mr-4 mb-4 lg:mb-0">
                            <div className="bg-gray-200 h-4 w-1/2 rounded mb-1"></div>
                            <div className="bg-gray-200 h-3 w-1/3 rounded"></div>
                        </div>
                        <div className="flex-1 bg-gray-200 p-3 rounded-lg">
                            <div className="bg-gray-200 h-4 w-1/2 rounded mb-1"></div>
                            <div className="bg-gray-200 h-3 w-1/3 rounded"></div>
                        </div>
                    </div>

                    {/* Descripción general */}
                    <div className="mt-8 mb-8">
                        <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                    </div>

                    {/* Dueño */}
                    {!isMyPet && (<div className="flex items-center mb-6">
                        <div className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] lg:w-[60px] lg:h-[60px] overflow-hidden rounded-full">
                            <div className="bg-gray-200 w-full h-full rounded-full"></div>
                        </div>
                        <div className="ml-4">
                            <div className="bg-gray-200 h-4 w-24 rounded mb-1"></div>
                            <div className="bg-gray-200 h-3 w-20 rounded"></div>
                        </div>
                    </div>)}

                </div>

                {/* Botón de Adoptar */}
                {!isMyPet && (<div>
                    <div className="bg-gray-200 h-10 w-full sm:w-full lg:w-3/5 rounded-3xl mx-auto block"></div>
                </div>)}

            </div>
        </div>
    );
}

export default PetInformationSkeleton;