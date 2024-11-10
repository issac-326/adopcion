'use client';

import Link from "next/link";
import { signupValidator } from "@/validations/signup";
import React, { useState } from 'react';
import InputField from "@/components/ui/InputField";
import { addUser, imagenCloudinary, registerCometChatUser } from "./actions";
import SuccessNotification from "@/components/ui/SuccesNotification";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

interface usuario {
  apellido1: string | null;
  apellido2: string | null;
  contrasena: string;
  correo: string;
  fecha_creacion: string | null;
  id_estado: number | null;
  id_mascota_favorita: number | null;
  id_tipo_usuario: number | null;
  id_usuario: number;
  imagen: string | null;
  nombre1: string;
  nombre2: string | null;
  reset_token: string | null;
  telefono: string | null;
}


export default function Register() {
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userExists, setUserExists] = useState(false);
  const [imagen, setImagen] = useState("/usuario-default.jpg"); 
  const [newImage, setNewImage] = useState<File | null>(null);
  const [data, setData] = useState<usuario | null | undefined>(null); 
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName:'',
    middleName:'',
    lastName1:'',
    lastName2:'',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [isSuccess, setIsSuccess] = useState(false); // Control de éxito

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


// Función para subir la nueva imagen a Cloudinary y actualizar la base de datos
const handleSignUp = async (formData: FormData) => {
  const formResult = signupValidator(formData);

  if (formResult.isValid) {
    setUserExists(false);
    try {
      // Agregamos al usuario
      const user = await addUser(formData, imageUrl);
      setData(user); // Actualizamos el estado para uso posterior

      // Usamos directamente el objeto user en lugar de data
      if (user && user.id_usuario) {
        const formCometChat = new FormData();
        formCometChat.append('uid', user.id_usuario.toString());
        formCometChat.append('name', user.nombre1);
        formCometChat.append('email', user.correo);

        // Registra al usuario en CometChat
        const cometChat = await registerCometChatUser(formCometChat);
      }

      setIsSuccess(true);
      router.push('/login');

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

  return (
    <div className="min-h-screen flex items-center justify-center">
      {isSuccess && (
        <SuccessNotification message="Your account has been created successfully" />
      )}
      <form className="flex flex-col items-center p-6 rounded-lg">
        <div className="flex items-center flex-col mb-6">
          <p className="text-[24px] font-bold text-black">¡Bienvenido!</p>
          <p className="text-[12px] text-black">Crea tu cuenta</p>
        </div>

        

        {/* Imagen de perfil y área de arrastrar y soltar */}
        <div className="flex flex-col items-center mb-6">
    <img src={imagen} alt="Imagen de perfil" className="w-40 h-40 rounded-full mb-4 object-cover"  />
    
    <div className=" flex items-center justify-between w-full">
    <div
    {...getRootProps()}
    className={` rounded-full px-4 py-2 transition duration-300 ease-in-out flex flex-col justify-center items-center border ${
      isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
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
         {/* Fila de nombres */}
         <div className="flex space-x-4">
          <div className="flex flex-col">
            <InputField
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Primer Nombre"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && <div className="text-red-500 text-xs animate-shake mt-2">{errors.firstName}</div>}
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
        </div>

        {/* Fila de apellidos */}
        <div className="flex space-x-4 mt-4">
          <div className="flex flex-col">
            <InputField
              id="lastName1"
              name="lastName1"
              type="text"
              placeholder="Primer Apellido"
              value={formData.lastName1}
              onChange={handleInputChange}
            />
            {errors.lastName1 && <div className="text-red-500 text-xs animate-shake mt-2">{errors.lastName1}</div>}
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

        {/* Fila de correo y teléfono */}
        <div className="flex space-x-4 mt-4">
          <div className="flex flex-col">
            <InputField
              id="email"
              name="email"
              type="text"
              placeholder="Correo"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <div className="text-red-500 text-xs mt-2 w-56 break-words">{errors.email}</div>}
            {userExists && <div className="text-red-500 text-xs animate-shake mt-2">El correo ya está registrado</div>}
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
            {errors.phone && <div className="text-red-500 text-xs mt-2 w-56 break-words">{errors.phone}</div>}
          </div>
        </div>

        {/* Fila de contraseña */}
        <div className="flex space-x-4 mt-4">
          <div className="flex flex-col">
            <InputField
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <div className="text-red-500 text-xs mt-2 w-56 break-words">{errors.password}</div>}
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
            {errors.confirmPassword && <div className="text-red-500 text-xs mt-2 w-56 break-words">{errors.confirmPassword}</div>}
          </div>
        </div>

        {/* Botón de envío */}
        <button formAction={handleSignUp} className="hover:scale-105 mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white hover:bg-[#ff9060]">
          Registrarme
        </button>

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
