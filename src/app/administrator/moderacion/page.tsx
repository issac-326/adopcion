'use client';

import { useState, useEffect } from 'react';
import { addModerator, imagenCloudinary } from './actions';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import InputField from '@/components/ui/InputField';

export default function RegisterModeratorPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName1: '',
    lastName2: '',
    email: '',
    password: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [imagen, setImagen] = useState("https://res.cloudinary.com/dvqtkgszm/image/upload/v1731795791/avatar_o9cpas.avif");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Configuración de useDropzone para subir imágenes
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setNewImage(acceptedFiles[0]);
        setImagen(URL.createObjectURL(acceptedFiles[0])); // Vista previa
      }
    },
    accept: { 'image/*': [] },
    multiple: false,
    maxSize: 10000000,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  // Función para subir la nueva imagen a Cloudinary y actualizar la base de datos
  const handleImageChange = async () => {
    console.log(newImage)
    if (!newImage) return;

    const formData = new FormData();
    formData.append('file', newImage);

    const { data: dataClo, error } = await imagenCloudinary(formData);
    if (error) {
      toast.error("Error al subir la imagen");
      console.error("Error al subir la imagen:", error);
      return;
    }

    const image1 = dataClo.secure_url;
    setImageUrl(image1);

    toast.success("Imagen subida con éxito");
  };


  const handleSiguienteClick = async () => {
    if (pageIndex === 2) {
      const formDataInstance = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataInstance.append(key, value);
      });
      try {
        await addModerator(formDataInstance, imageUrl);
        toast.success('Moderador registrado con éxito.');
        router.push('/administrator/moderacion/moderators');
      } catch (error) {
        toast.error('Error al registrar moderador.');
      }
    } else {
      setPageIndex(pageIndex + 1);
    }
  };

  // Cambia la visibilidad de los pasos según el índice de página
  useEffect(() => {}, [pageIndex]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="flex flex-col items-center p-6 rounded-lg">
        <div className="flex items-center flex-col mb-6">
          <p className="text-[24px] font-bold text-black">¡Registra un Moderador!</p>
          <p className="text-[12px] text-black">Llena la información requerida</p>
        </div>

        {/* Paso 1: Información Personal */}
        {pageIndex === 0 && (
          <div className="flex flex-col justify-center items-center">
            <InputField
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Primer Nombre"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <InputField
              id="middleName"
              name="middleName"
              type="text"
              placeholder="Segundo Nombre (opcional)"
              value={formData.middleName}
              onChange={handleInputChange}
            />
            <InputField
              id="lastName1"
              name="lastName1"
              type="text"
              placeholder="Primer Apellido"
              value={formData.lastName1}
              onChange={handleInputChange}
            />
            <InputField
              id="lastName2"
              name="lastName2"
              type="text"
              placeholder="Segundo Apellido (opcional)"
              value={formData.lastName2}
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* Paso 2: Contacto */}
        {pageIndex === 1 && (
          <div className="flex flex-col mt-4">
            <InputField
              id="email"
              name="email"
              type="email"
              placeholder="Correo"
              value={formData.email}
              onChange={handleInputChange}
            />
            <InputField
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
            />
            <InputField
              id="phone"
              name="phone"
              type="text"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* Paso 3: Imagen */}
        {pageIndex === 2 && (
          <div className="flex flex-col items-center justify-center">
            <img src={imagen} alt="Vista previa" className="w-40 h-40 rounded-full mb-4" />
            <div
              {...getRootProps()}
              className={`rounded-full px-4 py-2 border ${
                isDragActive ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
              } cursor-pointer`}
            >
              <input {...getInputProps()} />
              <p>{isDragActive ? 'Editando' : 'Subir Imagen'}</p>
            </div>
            {newImage && (
              <button
                type="button"
                onClick={handleImageChange}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
            )}
          </div>
        )}

        <button
          type="button"
          className="hover:scale-105 mt-6 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white"
          onClick={handleSiguienteClick}
        >
          {pageIndex === 2 ? 'Registrar' : 'Siguiente'}
        </button>
      </form>
    </div>
  );
}
