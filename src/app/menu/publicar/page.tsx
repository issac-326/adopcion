'use client';

import React, { useEffect, useState, startTransition } from 'react';
import { getDepartamentos } from "@/app/menu/inicio/actions";
import { Button } from "@/components/ui/button";
import { publicacionValidator } from '@/validations/publicacion';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useDropzone } from 'react-dropzone';
import { imagenCloudinary, crearPublicacion } from './actions';
import { toast } from "react-toastify";
import InputFieldSmall from '@/components/ui/InputFieldSmall';
import Departamentos from '@/types/Departamentos';
import InputFieldFull from '@/components/ui/InputFieldFull';
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';

export default function AnimalForm() {
  if (typeof window !== 'undefined'){
    localStorage.setItem('selectedIndex', '4'); 
  }

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    console.log('Archivo seleccionado:', acceptedFiles[0]);
  };

  const handleRefresh = () => {
    if(typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles
  } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    maxSize: 10000000,
  });

  // Actualiza el estado al cambiar los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para manejar el envío del formulario y crear una nueva publicación
  const handleSignUp = async (formData: FormData) => {
    formData.append('sexo', selectedSexo);
    formData.append('tipoAnimal', selectedTipoAnimal);
    formData.append('departamento', selectedDepartamento);

    if (acceptedFiles.length > 0) {
      formData.append('image', ' '); // Campo temporal para validación
    }

    const formResult = publicacionValidator(formData);

    if (formResult.isValid) {
      startTransition(async () => {
        if (acceptedFiles.length > 0) {
          const formImagen = new FormData();
          formImagen.append('file', acceptedFiles[0]);

          const { data: dataClo, error } = await imagenCloudinary(formImagen);
          if (error) {
            console.error("Error al subir la imagen:", error?.message || "Sin datos de imagen");
            return;
          }

          formData.append('imagen', dataClo.secure_url);
        }

        // Crear la publicación con los datos del usuario autenticado
        try {
          await crearPublicacion(formData);
          toast.success("¡Mascota publicada con éxito!");
          router.push('/menu/perfil');
        } catch (error) {
          console.error("Error al crear publicación:", error);
          toast.error("Error al crear la publicación.");
        }
      });
    } else {
      setErrors(formResult.errors);
    }
  };

  // Carga de departamentos al montar el componente
  useEffect(() => {
    const obtenerDepartamentos = async () => {
      try {
        const data = await getDepartamentos();
        setDepartamentos(data);
      } catch (error) {
        console.error("Error al obtener los departamentos:", error);
      }
    };

    obtenerDepartamentos();
  }, []);

  const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className='mx-4 my-6' >
      <p className="text-[24px] font-bold text-black flex justify-center">¡Haz tu publicación!</p>
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
              <SelectContent>
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
          <InputFieldSmall
            id="anos"
            name="anos"
            type="text"
            placeholder="Años"
            value={formData.anos}
            onChange={handleInputChange}
            required
          />
          {errors.anos && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.anos}</div>}

          <InputFieldSmall
            id="meses"
            name="meses"
            type="text"
            placeholder="Meses"
            value={formData.meses}
            onChange={handleInputChange}
            required
          />
          {errors.meses && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.meses}</div>}
        </div>

        <div className='grid gap-4 grid-cols-2'>
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

          <Select value={selectedDepartamento} onValueChange={setSelectedDepartamento}>
            <SelectTrigger className="rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-2">
              <SelectValue placeholder="Selecciona el departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Departamento</SelectLabel>
                {departamentos.length > 0 ? (
                  departamentos.map((departamento, index) => (
                    <SelectItem key={index} value={departamento.id.toString()}>{departamento.descripcion}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="perro">No hay departamentos disponibles</SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.departamento && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.departamento}</div>}
        </div>

        <Textarea
          placeholder="Aquí puedes agregar información adicional, como sus vacunas, condiciones médicas, etc."
          value={formData.descripcion}
          onChange={handleChangeTextarea}
          id="descripcion"
          name="descripcion"
          className='h-[100px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-2'
        />
        {errors.descripcion && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.descripcion}</div>}

        <div {...getRootProps()} className="mt-4 flex flex-col justify-center items-center rounded-lg border border-dashed px-6 py-10 cursor-pointer">
          <input name='file' {...getInputProps()} />
          {acceptedFiles.length > 0 ? (
            <p>Imagen seleccionada: {acceptedFiles[0].name}</p>
          ) : (
            <>
              <PhotoIcon className="mx-auto h-12 w-12 text-neutral-400" aria-hidden="true" />
              <p>Subir un archivo o arrastra y suelta aquí</p>
            </>
          )}
          {acceptedFiles.length > 0 && (
            <img
              src={URL.createObjectURL(acceptedFiles[0])}
              alt="Vista previa"
              className="h-40 w-40 mt-2 mx-auto rounded-full"
            />
          )}
          {errors.image && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.image}</div>}
        </div>

        <button
          formAction={handleSignUp}
          className="hover:scale-105 hover:bg-[#ff9060] my-20 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white mx-auto"
        >
          Dar en adopción
        </button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¡Éxito!</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              La publicación fue publicada exitosamente.
            </div>
            <DialogFooter>
              <Button onClick={handleRefresh} className="w-full bg-[#FFA07A]">
                ¡Aceptar!
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </div>
  );
}
