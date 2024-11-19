'use client';

import Link from "next/link";
import { signupValidator } from "@/validations/signup";
import React, { useEffect, useState } from 'react';
import InputField from "@/components/ui/InputField";
import { addUser, imagenCloudinary } from "./actions";
import SuccessNotification from "@/components/ui/SuccesNotification";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

export default function Register() {
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userExists, setUserExists] = useState(false);
  const [imagen, setImagen] = useState("https://res.cloudinary.com/dvqtkgszm/image/upload/v1731795791/avatar_o9cpas.avif");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName1: '',
    lastName2: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [isSuccess, setIsSuccess] = useState(false); // Control de éxito
  const [showPersonalInputs, setShowPersonalInputs] = useState(true); // Control de visibilidad de los campos de nombres
  const [showContactInputs, setShowContactInputs] = useState(false); // Control de visibilidad de los campos de contacto
  const [showAvatarInputs, setShowAvatarInputs] = useState(false); // Control de visibilidad de los campos de imagen
  const [pageIndex, setPageIndex] = useState(0); // Control de índice de página

  // Configuración de useDropzone con el estado isDragActive
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setNewImage(acceptedFiles[0]);
        setImagen(URL.createObjectURL(acceptedFiles[0])); // Muestra una vista previa de la imagen seleccionada
      }
    },
    accept: { 'image/*': [] },
    multiple: false,
    maxSize: 10000000
  });

  // Cambia los campos de nombres, contacto e imagen según el índice de página
  useEffect(() => {
    switch (pageIndex) {
      case 0:
        setShowPersonalInputs(true);
        setShowContactInputs(false);
        setShowAvatarInputs(false);
        break;
      case 1:
        setShowPersonalInputs(false);
        setShowContactInputs(true);
        setShowAvatarInputs(false);
        break;
      case 2:
        setShowPersonalInputs(false);
        setShowContactInputs(false);
        setShowAvatarInputs(true);
        break;
      default:
        break;
    }
  }, [pageIndex]);

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
  };

  // Función que valida los datos del formulario y envía los datos al servidor
  const handleSignUp = async (formData: FormData) => {
    const formResult = signupValidator(formData);

    // Si hay errores en la validación, se muestran en pantalla; si no, se registra al usuario
    if (formResult.isValid) {
      setUserExists(false);
      try {
        const data = await addUser(formData, imageUrl);
        console.log('User added successfully:', data);
        router.push('/login');
        setIsSuccess(true);
      } catch (error) {
        setUserExists(true);
        console.error("Error en el registro:", error);
      }
    } else {
      setErrors(formResult.errors);
    }
  };

  // Función que captura el cambio en los inputs y actualiza el estado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSiguienteClick = () => {
    console.log(pageIndex);
    const formDataInstance = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataInstance.append(key, value);
    });

    const response = signupValidator(formDataInstance);
    setErrors(response.errors);
    console.log(response.errors);

    console.log(response)

    if (pageIndex === 0 && response.errors.firstName === '' && response.errors.lastName1 === '') {
      {
        setPageIndex((prevIndex) => (prevIndex + 1) % 3);
      }
    } else if (pageIndex === 1 && response.errors.email === '' && response.errors.phone === '' && response.errors.password === '' && response.errors.confirmPassword === '') {
      setPageIndex((prevIndex) => (prevIndex + 1) % 3);
    }
    else if (pageIndex === 2) {
      handleSignUp(formDataInstance);
    }

    console.log(pageIndex)
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {isSuccess && (
        toast.success("Se ha registrado exitosamente, inicie sesión para continuar")
      )}
      <form className="flex flex-col items-center p-6 rounded-lg">
        <div className="flex items-center flex-col mb-6">
          <p className="text-[24px] font-bold text-black">¡Bienvenido!</p>
          <p className="text-[12px] text-black">Crea tu cuenta</p>
        </div>

        {/* Fila de Personal Info */}
        {showPersonalInputs && (
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col">
              <InputField
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Primer Nombre"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && <div className="text-red-500 pl-4 text-xs animate-shake mt-2">{errors.firstName}</div>}
            </div>

            <div className="flex flex-col">
              <InputField
                id="middleName"
                name="middleName"
                type="text"
                placeholder="Segundo Nombre (opcional)"
                value={formData.middleName}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col">
              <InputField
                id="lastName1"
                name="lastName1"
                type="text"
                placeholder="Primer Apellido"
                value={formData.lastName1}
                onChange={handleInputChange}
              />
              {errors.lastName1 && <div className="text-red-500 pl-4 text-xs animate-shake mt-2">{errors.lastName1}</div>}
            </div>

            <div className="flex flex-col">
              <InputField
                id="lastName2"
                name="lastName2"
                type="text"
                placeholder="Segundo Apellido (opcional)"
                value={formData.lastName2}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {/* Fila de correo y teléfono */}
        {showContactInputs && (
          <div className="flex flex-col mt-4">
            <div className="flex flex-col">
              <InputField
                id="email"
                name="email"
                type="text"
                placeholder="Correo"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <div className="text-red-500 text-xs pl-4 mt-2 w-56 break-words">{errors.email}</div>}
              {userExists && <div className="text-red-500 text-xs pl-4 animate-shake mt-2">El correo ya está registrado</div>}
            </div>

            <div className="flex flex-col">
              <InputField
                id="phone"
                name="phone"
                type="text"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && <div className="text-red-500 text-xs mt-2 pl-4 w-56 break-words">{errors.phone}</div>}
            </div>

            <div className="flex flex-col">
              <InputField
                id="password"
                name="password"
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <div className="text-red-500 text-xs pl-4 mt-2 w-56 break-words">{errors.password}</div>}
            </div>

            <div className="flex flex-col">
              <InputField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && <div className="text-red-500 pl-4 text-xs mt-2 w-56 break-words">{errors.confirmPassword}</div>}
            </div>
          </div>

        )}

        {/* Imagen de perfil y área de arrastrar y soltar */}
        {showAvatarInputs && (
          <div className="flex flex-col items-center justify-center mb-6">
            <img src={imagen} alt="Imagen de perfil" className="w-40 h-40 rounded-full mb-4 object-cover" />

            <div className=" flex items-center justify-center w-full">
              <div
                {...getRootProps()}
                className={` rounded-full px-4 py-2 transition duration-300 ease-in-out flex flex-col justify-center items-center border ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
                  } cursor-pointer hover:border-blue-500 hover:bg-blue-50`}
              >
                <input {...getInputProps()} />
                <p className="text-gray-600 text-center">
                  {isDragActive ? "Editando" : "Editar"}
                </p>
              </div>


              {newImage && (
                <button
                  type="button"
                  onClick={handleImageChange}
                  className="border ml-2 border-gray-300 hover:border-blue-500 text-gray-600 rounded-full px-4 py-2 transition duration-300 ease-in-out"
                >
                  Confirmar
                </button>
              )}
            </div>
          </div>
        )}

        <button type="button" className="hover:scale-105 mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white hover:bg-[#ff9060] shadow-[0_4px_4px_rgba(0,0,0,0.25)]" onClick={handleSiguienteClick}>
          {pageIndex === 2 ? 'Registrarme' : 'Siguiente'}
        </button>

        {pageIndex == 0 || pageIndex == 1  && (
          <button
            type="button"
            className="hover:scale-105 mt-2 w-[270px] h-[40px] bg-[#e4e6eb] rounded-[50px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] text-sm hover:bg-[#ff9060] text-[#4b4f5c]"
            onClick={() => setPageIndex((prevIndex) => (prevIndex - 1) % 3)}
          >
            Atrás
          </button>
        )}


        <div className="flex mt-6 justify-center">
          <p className="text-xs text-black">¿Ya tienes una cuenta?</p>
          <Link href="/login" className="text-xs text-[#FFA07A] pl-2">¡Inicia sesión aqui!</Link>
        </div>
      </form>
      <div className="absolute bottom-0 right-0 flex items-center justify-center">
        <img
          src="/Logo.svg"
          alt="Descripción del logo"
          style={{
            color: "#ffa07a",
            width: '20rem',  // Cambia a un ancho adecuado
            height: '20rem', // Cambia a un alto adecuado
            objectFit: 'contain', // Asegura que la imagen se ajuste sin distorsión
            opacity: 0.4,
          }}
        />
      </div>
    </div>
  );
}
