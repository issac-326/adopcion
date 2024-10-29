'use client'

import React, { useEffect, useState } from 'react';
import { getDepartamentos } from "@/app/menu/inicio/actions";
import { Button } from "@/components/ui/button";
import { publicacionValidator } from '@/validations/publicacion';
import { PhotoIcon } from '@heroicons/react/24/solid'
import { type DropzoneState, useDropzone } from 'react-dropzone';
import { imagenCloudinary, crearPublicacion } from './actions';
import InputField from '@/components/ui/InputField';
import Departamentos from '@/types/Departamentos';
import { startTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface InputProps {
  id: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minLength?: number;
}
export default function AnimalForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedTipoAnimal, setSelectedTipoAnimal] = useState("");
  const [selectedSexo, setSelectedSexo] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    sexo: '',
    tipoAnimal: '',
    descripcion: '',
    anos: '',
    meses: '',
    departamento: '',
    imagen: '',
    peso: '',
  });


  const onDrop = async (acceptedFiles: File[]) => {
    // Verifica que se haya seleccionado al menos un archivo
    console.log('Archivo seleccionado: ', acceptedFiles[0])
  }

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
    acceptedFiles
  }: DropzoneState = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: false,
    maxSize: 10000000
  })

  const limpiarFormulario = () => {
    setFormData({
        nombre: '',
        sexo: '',
        tipoAnimal: '',
        descripcion: '',
        anos: '',
        meses: '',
        departamento: '',
        imagen: '',
        peso: '',
    }); // Limpia los archivos seleccionados
};

  // Función que captura el cambio en los inputs y actualiza el estado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleSignUp = async (formData: FormData) => {
    formData.append('sexo', selectedSexo);
    formData.append('tipoAnimal', selectedTipoAnimal);
    formData.append('departamento', selectedDepartamento);
    const formResult = publicacionValidator(formData);

    if (formResult.isValid) {
      startTransition(async () => {
        if (acceptedFiles.length > 0) {
          // Cambia esta línea para llamar a la función de subir imagen con formDataUpload
          const formImagen = new FormData();
          formImagen.append('file', acceptedFiles[0]);
          const { data: dataClo, error } = await imagenCloudinary(formImagen);
          if (error) {
            console.error("Error al subir la imagen:", error?.message || "Sin datos de imagen");
            return
          }

          // Actualiza el imagen con la url de la imagen subida
          formData.append('imagen', dataClo.secure_url);
        }
        // Crear la publicación
        const formResult = await crearPublicacion(formData);
        limpiarFormulario(); 
      });
    } else {
      setErrors(formResult.errors);
    }
  };

  /* Obtiene los departamentos y los carga en el estado departamentos */
  useEffect(() => {
    try {

      const obtenerDepartamentos = async () => {
        const data = await getDepartamentos();
        console.log("Departamentos obtenidos:", data);
        setDepartamentos(data);
      };

      obtenerDepartamentos();

    } catch (error) {
      console.error("Error al obtener los departamentos:", error);
    }
  }, [])

  return (
    <>
      <form className="space-y-4 mx-auto mt-10 flex flex-col items-center">
        <div>  
          <InputField
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
          {errors.nombre && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.nombre}</div>}
        </div>
        <div>
          <InputField
            id="peso"
            name="peso"
            type="text"
            placeholder="Peso"
            value={formData.peso}
            onChange={handleInputChange}
            required
          />
          {errors.peso && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.peso}</div>}
        </div>

        <div>
          <Select value={selectedSexo} onValueChange={setSelectedSexo}>
            <SelectTrigger className="rounded-full w-[330px]">
              <SelectValue placeholder="Selecciona el sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sexo</SelectLabel>
                <SelectItem value="macho">Macho</SelectItem>
                <SelectItem value="hembra">Hembra</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.select && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.select}</div>}
        </div>

        <div>
          <Select value={selectedTipoAnimal} onValueChange={setSelectedTipoAnimal}>
            <SelectTrigger className="w-[330px] rounded-full">
              <SelectValue placeholder="Selecciona el tipo de animal" />
            </SelectTrigger>
            <SelectContent >
              <SelectGroup>
                <SelectLabel>Tipo de Animal</SelectLabel>
                <SelectItem value="1">Perro</SelectItem>
                <SelectItem value="2">Gato</SelectItem>
                <SelectItem value="3">Ave</SelectItem>
                <SelectItem value="4">Otro</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.tipoAnimal && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.tipoAnimal}</div>}
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <InputField
            id="anos"
            name="anos"
            type="text"
            placeholder="Años"
            value={formData.anos}
            onChange={handleInputChange}
            required
          />
          {errors.anos && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.anos}</div>}
          <InputField
            id="meses"
            name="meses"
            type="text"
            placeholder="Meses"
            value={formData.meses}
            onChange={handleInputChange}
            required
          />
          {errors.meses && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.meses}</div>}
        </div>

        <div>
          <Select value={selectedDepartamento} onValueChange={setSelectedDepartamento}>
            <SelectTrigger className="rounded-full w-[330px]">
              <SelectValue placeholder="Selecciona el departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Departamento</SelectLabel>
                {departamentos && departamentos.length > 0 ? (
                  departamentos.map((departamento, index) => (
                    <SelectItem key={index} value={departamento.id.toString()} >{departamento.descripcion}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="perro">No hay departamentos disponibles</SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.departamento && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.departamento}</div>}
        </div>
        <div>
          <input
            id="descripcion"
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleInputChange}
            className="focus:outline-none focus:border-blue-800/2 placeholder:text-gray-400 text-xs text-black bg-white rounded-[20px] pl-5 pt-2 mt-5 w-[330px] h-[100px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
          />
          {errors.descripcion && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.descripcion}</div>}
        </div>
        <div
          {...getRootProps()}
          className={`mt-4 flex dark:text-gray-400 text-gray-600 flex-col justify-center items-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-100/25 px-6 py-10 transition-colors duration-500 `}
        >
          <input name='file' {...getInputProps()} />
          {acceptedFiles.length > 0 ? (
            <p>Imagen seleccionada: {acceptedFiles[0].name}</p>
          ) : (
            <>
              {isDragAccept && <p>Suelta la imagen</p>}
              {isDragReject && <p>Solo se permiten imágenes</p>}
              {!isDragActive && (
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-600" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md  font-semibold text-sec focus-within:outline-none focus-within:ring-2 focus-within:ring-sec focus-within:ring-offset-2 hover:text-sec"
                    >
                      <span>Subir un archivo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG hasta 10MB</p>
                </div>
              )}
            </>
          )}

          {/* Muestra la vista previa de la imagen seleccionada */}
          {acceptedFiles.length > 0 && (
            <div className="flex justify-center">
              <img
                src={URL.createObjectURL(acceptedFiles[0])}
                alt={``}
                className="h-40 w-40 mt-2 mx-auto rounded-full aspect-square object-cover border-4 border-[#FFA07A]/50" />
            </div>
          )}
        </div>

        {/* Renderiza la imagen si imageUrl está definido */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Imagen cargada"
            className="mt-4 w-32 h-auto rounded-lg shadow-lg" // Cambia 'w-32' por el tamaño deseado
          />
        )}

        <button formAction={handleSignUp} className="hover:scale-105 mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white">
          Registrarme
        </button>
        

      </form>
    </>
  );
}