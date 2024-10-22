'use client'

import React, { useEffect, useState } from 'react';
import { getCategorias, getCategoriaEspecifica, getDepartamentos } from "@/app/menu/inicio/actions";
import { Button } from "@/components/ui/button";
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

const InputField: React.FC<InputProps> = ({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="focus:outline-none focus:border-blue-800/2 placeholder:text-gray-400 text-xs text-black bg-white rounded-[50px] pl-5 pt-2 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    />
  );
};

export default function AnimalForm() {
  const [departamentos, setDepartamentos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    sexo: '',
    tipoAnimal: '',
    edad: '',
    descripcion: '',
    vacunas: '',
    ciudad: '',
  });
  const [image, setImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos del formulario y la imagen a Cloudinary
    console.log('Datos del formulario:', formData);
    console.log('Imagen:', image);
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10 flex flex-col items-center">
      <InputField
        id="nombre"
        name="nombre"
        type="text"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleInputChange}
        required
      />

      <Select onValueChange={handleSelectChange('sexo')}>
        <SelectTrigger className="w-[330px]">
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

      <Select onValueChange={handleSelectChange('tipoAnimal')}>
        <SelectTrigger className="w-[330px]">
          <SelectValue placeholder="Selecciona el tipo de animal" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tipo de Animal</SelectLabel>
            <SelectItem value="perro">Perro</SelectItem>
            <SelectItem value="gato">Gato</SelectItem>
            <SelectItem value="ave">Ave</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className='grid grid-cols-2 gap-4'>
        <InputField
          id="Años"
          name="Años"
          type="text"
          placeholder="Años"
          value={formData.edad}
          onChange={handleInputChange}
          required
        />
        <InputField
          id="meses"
          name="meses"
          type="text"
          placeholder="Meses"
          value={formData.edad}
          onChange={handleInputChange}
          required
        />
      </div>

      <textarea
        id="descripcion"
        name="descripcion"
        placeholder="Descripción"
        value={formData.descripcion}
        onChange={handleInputChange}
        className="focus:outline-none focus:border-blue-800/2 placeholder:text-gray-400 text-xs text-black bg-white rounded-[20px] pl-5 pt-2 mt-5 w-[330px] h-[100px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
      />

      <InputField
        id="vacunas"
        name="vacunas"
        type="text"
        placeholder="Vacunas"
        value={formData.vacunas}
        onChange={handleInputChange}
      />

      <Select onValueChange={handleSelectChange('tipoAnimal')}>
        <SelectTrigger className="w-[330px]">
          <SelectValue placeholder="Selecciona el departamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Departamento</SelectLabel>
            {departamentos && departamentos.length > 0 ? (
              departamentos.map((departamento, index) => (
                <SelectItem value={departamento.descripcion}>{departamento.descripcion}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="perro">No hay departamentos disponibles</SelectItem>
                    )}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleImageDrop}
        className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer"
      >
        <p className="text-xs text-black">Arrastra y suelta una imagen aquí o haz clic para seleccionar</p>
        <input
          id="imagen"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {image && <p className="mt-2 text-xs">Imagen seleccionada: {image.name}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-300 text-white rounded-[50px] py-2 px-4 text-sm font-medium hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Enviar
      </Button>
    </form>
  );
}