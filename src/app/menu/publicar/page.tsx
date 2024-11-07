'use client'

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { getDepartamentos } from "@/app/menu/inicio/actions";
import { Button } from "@/components/ui/button";
import { publicacionValidator } from '@/validations/publicacion';
import { PhotoIcon } from '@heroicons/react/24/solid'
import { type DropzoneState, useDropzone } from 'react-dropzone';
import { imagenCloudinary, crearPublicacion } from './actions';
import { toast } from "react-toastify";
import InputFieldSmall from '@/components/ui/InputFieldSmall';
import Departamentos from '@/types/Departamentos';
import InputFieldFull from '@/components/ui/InputFieldFull';
import { Textarea } from "@/components/ui/textarea"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

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
import { useRouter } from 'next/navigation';
import { image } from '@nextui-org/theme';


export default function AnimalForm() {
  localStorage.setItem('selectedIndex', '4'); 
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedTipoAnimal, setSelectedTipoAnimal] = useState("");
  const [selectedSexo, setSelectedSexo] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
  const [text, setText] = useState('');
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
    image: ''
  });

  const userId = localStorage.getItem('userId');



  const onDrop = async (acceptedFiles: File[]) => {
    // Verifica que se haya seleccionado al menos un archivo
    console.log('Archivo seleccionado: ', acceptedFiles[0])
  }
  const handleRefresh = () => {
    window.location.reload()
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



  // Función que captura el cambio en los inputs y actualiza el estado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };



  const handleSignUp = async (formData: FormData) => {
    if (!userId) {
      throw new Error('El ID de usuario no fue proporcionado');
    }
    console.log(formData)
    
    formData.append('sexo', selectedSexo);
    formData.append('tipoAnimal', selectedTipoAnimal);
    formData.append('departamento', selectedDepartamento);
    if (acceptedFiles.length > 0) {
      formData.append('image', ' ');
    }
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
        const formResult = await crearPublicacion(formData, userId);
        /* setIsModalOpen(true) */
        toast.success("¡Mascota publicada con éxito!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);

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
  const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  return (
    <>
      <p className="text-[24px] font-bold text-black flex justify-center mt-6">¡Haz tu publicación!</p>
      <form className="space-y-4 mx-auto mt-10 items-center w-[60%] grid grid-cols-1">
        <div>  
          <InputFieldFull
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
          {errors.nombre && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.nombre}</div>}
        </div>
        
        <div className='grid gap-4 grid-cols-2'>
          <div>
            <Select value={selectedSexo} onValueChange={setSelectedSexo}>
              <SelectTrigger className="rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-2">
                <SelectValue placeholder="Selecciona el sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="2">Macho</SelectItem>
                  <SelectItem value="1">Hembra</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.sexo && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.sexo}</div>}
          </div>

          <div>
            <Select value={selectedTipoAnimal} onValueChange={setSelectedTipoAnimal}>
              <SelectTrigger className="rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-2">
                <SelectValue placeholder="Selecciona el tipo de animal" />
              </SelectTrigger>
              <SelectContent >
                <SelectGroup>
                  <SelectItem value="1">Perro</SelectItem>
                  <SelectItem value="2">Gato</SelectItem>
                  <SelectItem value="3">Ave</SelectItem>
                  <SelectItem value="4">Otro</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.tipoAnimal && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.tipoAnimal}</div>}
          </div>
        </div>
        <div className='grid gap-4 grid-cols-2'>
          <div>
            <InputFieldSmall
              id="anos"
              name="anos"
              type="text"
              placeholder="Años"
              value={formData.anos}
              onChange={handleInputChange}
              required
            />
            {errors.anos && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 ">{errors.anos}</div>}
          </div>     
          <div>
            <InputFieldSmall
              id="meses"
              name="meses"
              type="text"
              placeholder="Meses"
              value={formData.meses}
              onChange={handleInputChange}
              required
            />
            {errors.meses && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 ">{errors.meses}</div>}
          </div>
          
        </div>

        <div className='grid gap-4 grid-cols-2'>
          <div>
            <InputFieldSmall
              id="peso"
              name="peso"
              type="text"
              placeholder="Peso (kg)"
              value={formData.peso}
              onChange={handleInputChange}
              required
            />
            {errors.peso && <p className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.peso}</p>}
          </div>
          
          <div>
            <Select value={selectedDepartamento} onValueChange={setSelectedDepartamento}>
              <SelectTrigger className="rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-2">
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
            {errors.departamento && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 ">{errors.departamento}</div>}
          </div>
        </div>
        <div>
          <Textarea placeholder="Aqui puedes agregar una informacion adicional, como sus vacunas, condiciones médicas, etc." value={formData.descripcion} onChange={handleChangeTextarea} id="descripcion"
            name="descripcion" className='h-[100px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-2' />
          {errors.descripcion && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 ">{errors.descripcion}</div>}
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
          {errors.image && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.image}</div>}
        </div>

        {/* Renderiza la imagen si imageUrl está definido */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Imagen cargada"
            className="mt-4 w-32 h-auto rounded-lg shadow-lg" // Cambia 'w-32' por el tamaño deseado
          />
        )}

        <button formAction={handleSignUp} className="hover:scale-105 hover:bg-[#ff9060] my-20 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white mx-auto">
          Dar en adopción
        </button>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¡Éxito!</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              La publicacion fue publicada exitosamente.
            </div>
            <DialogFooter>
              <Button onClick={handleRefresh} className="w-full bg-[#FFA07A]">
                ¡Aceptar!
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* <FontAwesomeIcon
          icon={faPaw}
          className="absolute bottom-20 opacity-30 transform rotate-12 text-[500px] z-0 text-orange-100 pointer-events-none" // pointer-events-none para que no interfiera con clics
        /> */}
      </form>
      

    </>
  );
}